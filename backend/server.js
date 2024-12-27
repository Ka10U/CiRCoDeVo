const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const db = require("./db");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Route pour enregistrer un nouvel utilisateur
app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], function (err) {
        if (err) {
            console.log("register error: ", err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID });
    });
});

// Route pour l'authentification des utilisateurs
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(400).json({ error: "User not found" });
        }
        if (!bcrypt.compareSync(password, row.password)) {
            return res.status(400).json({ error: "Invalid password" });
        }
        res.json({ message: "Login successful" });
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
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
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
                    return res.status(500).json({ error: error.message });
                }
                res.json({ message: "Password recovery email sent" });
            });
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
