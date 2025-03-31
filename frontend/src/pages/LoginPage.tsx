import { useState, useEffect } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Form from "../components/Form"
import LabelInput from "../components/LabelInput";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import { isAuthenticated } from "../utils/auth";


export default function LoginPage() {

    const navigate = useNavigate();
    
    useEffect(() => {
        if (isAuthenticated()) {
          navigate("/dashboard");
        }
      }, [navigate]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });

            const { token, stoken } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('stoken', stoken);

            navigate('/dashboard');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                setErrorMsg(message);
            } else {
                setErrorMsg("Unexpected error occurred.");
            }
        }
    }

    
    return(
        <div className="login-page flex flex-col justify-center items-center text-white bg-black min-h-screen">
            <img className="w-30 mb-6" src="/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">Welcome back to your file storage</p>
            <Form errorMsg={errorMsg} handleSubmit={handleSubmit} title="Log in" buttonText="Log in" belowButton={ <> or{" "} <u className="cursor-pointer"> <Link to="/signup">sign up</Link> </u> </> }>
                <LabelInput label="Email" name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                <div className="relative w-full">
                    <LabelInput type={showPassword ? "text" : "password"} name="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-6.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
                <u className="cursor-pointer text-xs"> <Link to="/recover-password">Forgot your password, again?</Link> </u>
            </Form>
        </div>
    )
}