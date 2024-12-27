import React, { useState } from "react";
import axios from "axios";

const RecoverPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/recover-password", {
                email,
            });
            alert("Recovery email sent");
            console.log(response.data);
        } catch (error) {
            alert("Recovery failed");
        }
    };

    return (
        <div className="auth-form">
            <h2>Recover Password</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Recover</button>
            </form>
        </div>
    );
};

export default RecoverPassword;
