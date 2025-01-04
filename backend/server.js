const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const db = require("./db");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

console.log("Server starting up...");
console.log("Web Token: ", process.env.JWT_SECRET);

// Configuration de Multer pour gérer les téléchargements de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// Route pour enregistrer un nouvel utilisateur
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = uuidv4();

    db.run(
        "INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)",
        [userId, username, email, hashedPassword],
        function (err) {
            if (err) {
                console.log("Register Error: ", err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: userId });
        }
    );
});

// Route pour l'authentification des utilisateurs
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) {
            console.log("Login Error: ", err);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            console.log("Login Error: User not found");
            return res.status(400).json({ error: "User not found" });
        }
        if (!bcrypt.compareSync(password, row.password)) {
            console.log("Login Error: Invalid Password");
            return res.status(400).json({ error: "Invalid password" });
        }
        // Générer un token JWT
        const token = jwt.sign({ userId: row.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

        console.log("Login successful !!");
        res.json({ message: "Login successful", userId: row.id, token });
    });
});

// Route pour la récupération de mot de passe
app.post("/recover-password", (req, res) => {
    const { email } = req.body;
    const tempPassword = Math.random().toString(36).slice(-8); // Génère un mot de passe temporaire
    const hashedTempPassword = bcrypt.hashSync(tempPassword, 10);
    const expirationTime = Date.now() + 24 * 60 * 60 * 1000; // 24 heures en millisecondes

    db.run(
        "UPDATE users SET password = ?, temp_password_expiration = ? WHERE email = ?",
        [hashedTempPassword, expirationTime, email],
        function (err) {
            if (err) {
                console.log("Recover pwd error: ", err);
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                console.log("Email not found for pwd recovery");
                return res.status(400).json({ error: "Email not found" });
            }

            // Configurer le transporteur de mail
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            // Configurer l'email
            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Recovery",
                text: `Your temporary password is: ${tempPassword}. It will expire in 24 hours.`,
            };

            // Envoyer l'email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("Recover pwd email error: ", err);
                    return res.status(500).json({ error: error.message });
                }
                res.json({ message: "Password recovery email sent" });
            });
        }
    );
});

// Route pour la réinitialisation de mot de passe
app.post("/reset/:token", (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run(
        "UPDATE users SET password = ?, temp_password_expiration = NULL WHERE password = ? AND temp_password_expiration > ?",
        [hashedPassword, token, Date.now()],
        function (err) {
            if (err) {
                console.log("Password reset error: ", err);
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                console.log("Invalid or expired token for pwd reset");
                return res.status(400).json({ error: "Invalid or expired token" });
            }
            res.json({ message: "Password reset successful" });
        }
    );
});

// Route pour créer un sondage
app.post("/polls/create", upload.single("image"), (req, res) => {
    const { userId, title, questions, votingPeriodStart, votingPeriodEnd, categories } = req.body;
    const pollId = uuidv4();
    const questionsString = JSON.stringify(questions);
    const categoriesString = JSON.stringify(categories);
    const imageUrl = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

    db.serialize(() => {
        db.run(
            "INSERT INTO polls (id, creator_id, title, questions, voting_period_start, voting_period_end, categories, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [pollId, userId, title, questionsString, votingPeriodStart, votingPeriodEnd, categoriesString, imageUrl],
            function (err) {
                if (err) {
                    console.log("Poll creation error: ", err);
                    return res.status(500).json({ error: err.message });
                }

                // Mettre à jour la liste des sondages créés par l'utilisateur
                db.get("SELECT created_polls FROM users WHERE id = ?", [userId], (err, row) => {
                    if (err) {
                        console.log("User polls fetch error: ", err);
                        return res.status(500).json({ error: err.message });
                    }
                    let createdPolls = row.created_polls ? JSON.parse(row.created_polls) : [];
                    createdPolls.push(pollId);
                    db.run(
                        "UPDATE users SET created_polls = ? WHERE id = ?",
                        [JSON.stringify(createdPolls), userId],
                        function (err) {
                            if (err) {
                                console.log("User created_polls update error: ", err);
                                return res.status(500).json({ error: err.message });
                            }
                            res.json({ id: pollId });
                        }
                    );
                });
            }
        );
    });
});

// Route pour afficher un sondage
app.get("/poll/:id", (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM polls WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.log("Polls fetch error: ", err);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            console.log("Polls not found");
            return res.status(404).json({ error: "Poll not found" });
        }
        res.json(row);
    });
});

// Route pour afficher les sondages créés par un utilisateur
app.get("/polls/user/:id", (req, res) => {
    const { id } = req.params;

    db.all("SELECT * FROM polls WHERE creator_id = ?", [id], (err, rows) => {
        if (err) {
            console.log("User polls fetch error: ", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Route pour afficher les sondages mis en avant
app.get("/polls/featured", (req, res) => {
    db.all("SELECT * FROM polls ORDER BY RANDOM() LIMIT 5", (err, rows) => {
        if (err) {
            console.log("Featured polls fetch error: ", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Route pour afficher les données utilisateur
app.get("/user/:id", (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.log("User Error: ", err);
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        res.json(row);
    });
});

// Servir les images téléchargées
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
