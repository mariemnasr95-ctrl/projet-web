import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; 
import "./login.css";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

   
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
           
            console.log('Sending login request with:', {
                email: formData.username,
                password: formData.password
            });

           
            const response = await axios.post('http://localhost:8000/api/login', {
                email: formData.username, 
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
           
            const data = response.data;

            if (data.token) {
                
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    username: formData.username,
                    email: data.email || formData.username, 
                }));

                // Redirect to notes
                navigate('/notes');
            } else {
                setError('Login failed: No token received');
            }
        } catch (err) {
            const errorResponse = err.response?.data;
            let message = errorResponse?.message || 'Connection error. Please try again.';
            
           
            if (errorResponse?.errors) {
                const errors = errorResponse.errors;
                const errorMessages = Object.keys(errors).map(field => 
                    `${field}: ${errors[field].join(', ')}`
                ).join(' | ');
                message = `${message}: ${errorMessages}`;
            }
            
            setError(message);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login">
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    
                    {error && <div style={{color: 'red', marginBottom: '10px', textAlign: 'center'}}>{error}</div>}
                    
                    <div className="box">
                        <span className="icon">
                            <ion-icon name="person-outline"></ion-icon>
                        </span>
                        <input 
                            type="text" 
                            className="log" 
                            id="username" 
                            required  
                            value={formData.username}
                            onChange={handleChange}
                            placeholder=" "
                        />
                        <label htmlFor="username" className="log2">Username</label>
                    </div>
                    
                    <div className="box">
                        <span className="icon">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                        </span>
                        <input 
                            type="password" 
                            id="password" 
                            className="log"  
                            required  
                            value={formData.password}
                            onChange={handleChange}
                            placeholder=" "
                        />
                        <label htmlFor="password" className="log2">Password</label>
                    </div>
                    
                    <div className="reminder">
                        <label><input type="checkbox" /> Remember me </label>
                        <a href="#login">Forgot password?</a>
                    </div>
                    
                    <div>
                        <button type="submit" className="log1" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button><br />
                    </div>
                    
                    <span className="register-link">
                        don't have an account! <Link to="/register">inscriez vous</Link> 
                    </span>
                </form>
            </div>
        </div>
    );
}

export default Login;