import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Form from "../components/Form"
import LabelInput from "../components/LabelInput";
import { Link, Navigate } from "react-router-dom";
import axios from 'axios'


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });

            const { token } = response.data;
            localStorage.setItem('token', token);

            <Navigate to="/dashboard" />
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Login failed:', error.response?.data || error.message);
            } else {
                console.error('Login failed:', error);
            }
        }
    }

    
    return(
        <div className="login-page flex flex-col justify-center items-center font-mono text-white bg-black min-h-screen">
            <img className="w-30 mb-6" src="../public/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">Welcome back to your file storage</p>
            <Form handleSubmit={handleSubmit} title="Log in" buttonText="Log in" belowButton={ <> or{" "} <u className="cursor-pointer"> <Link to="/signup">sign up</Link> </u> </> }>
                <LabelInput label="Email" name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="relative w-full">
                    <LabelInput type={showPassword ? "text" : "password"} name="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-6.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
            </Form>
        </div>
    )
}