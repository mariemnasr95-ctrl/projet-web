import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; 
import "./register.css";

function Register() {
    const navigate = useNavigate();

    useEffect(() => {
        const script1 = document.createElement('script');
        script1.type = 'module';
        script1.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
        document.body.appendChild(script1);

        const script2 = document.createElement('script');
        script2.noModule = true;
        script2.src = "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
        document.body.appendChild(script2);

        return () => {
            document.body.removeChild(script1);
            document.body.removeChild(script2);
        };
    }, []);

  
    const [username, setUsername] = useState("");
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: username,
                    email: mail,
                    password: password,
                    password_confirmation: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success:", data);
                navigate("/login");
            } else {
                setError(data.message || "Erreur lors de l'inscription");
            }
        } catch (err) {
            console.error("Erreur réseau:", err);
            setError("Impossible de contacter le serveur.");
        }
    };

    return (
        <div className="register">
            <div>
                <h1>Register</h1>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div className="input1">
                        <span className="icon"><ion-icon name="person-outline"></ion-icon></span>
                        <input 
                            type="text" 
                            id="username" 
                            required 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} 
                        />
                        <label htmlFor="username">Username</label>
                        <br />
                    </div>
                    <div className="input1">
                        <span className="icon"><ion-icon name="mail-outline"></ion-icon></span>
                        <input 
                            type="email" 
                            required 
                            id="email" 
                            value={mail}
                            onChange={(e) => setMail(e.target.value)} 
                        />
                        <label htmlFor="email">E-mail</label>
                        <br />
                    </div>

                    <div className="input1">
                        <span className="icon"><ion-icon name="lock-closed-outline"></ion-icon></span>
                        <input 
                            type="password" 
                            required 
                            minLength="8" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <label htmlFor="mdp">Mot de passe </label><br />
                    </div>

                    <button type="submit">Register</button>
                    
                    <div className="register-link">
                        <span>Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;