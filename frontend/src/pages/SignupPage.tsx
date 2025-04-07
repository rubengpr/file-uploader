import { Link, useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useState, FocusEvent, useEffect } from "react"
import LabelInput from "../components/LabelInput"
import Form from "../components/Form"
import axios from 'axios';
import { isAuthenticated } from "../utils/auth"

export default function SignupPage() {
    
    const navigate = useNavigate();
        
        useEffect(() => {
            if (isAuthenticated()) {
              navigate("/dashboard");
            }
          }, [navigate]);
    
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)

    function toggleShowPassword() {
        setShowPassword(prev => !prev);
        setShowRepeatPassword(prev => !prev)
    }

    function handlePasswordBlur(e: FocusEvent<HTMLInputElement>) {
        validatePassword(e.target.value)
    }
    
    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
        if (!passwordRegex.test(password)) {
            setPasswordError("One capital letter, number and special character")
        } else {
            setPasswordError("")
        }
    }

    function handleEmailBlur(e: FocusEvent<HTMLInputElement>) {
        validateEmail(e.target.value)
    }
    
    function validateEmail(email: string) {
        const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
        if (!emailRegex.test(email)) {
            setEmailError("Should be a valid email address")
        } else {
            setEmailError("")
        }
    }

    function handleRepeatPasswordBlur(e: FocusEvent<HTMLInputElement>) {
        validateRepeatPassword(e.target.value)
    }

    function validateRepeatPassword(repeatPassword: string) {
        if (password !== repeatPassword) {
            setRepeatPasswordError("Passwords don't match")
        } else {
            setRepeatPasswordError("")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await axios.post(`${import.meta.env.API_URL}/api/auth/signup`, { email, password });

            const { token } = response.data
            localStorage.setItem('token', token);

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
        <div className="signup-page flex flex-col justify-center items-center text-white bg-black min-h-screen">
            <img className="w-30 mb-6" src="/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">One more step to store your files</p>
            <Form handleSubmit={handleSubmit} title="Sign up" buttonText="Sign up" belowButton={ <> or{" "} <u className="cursor-pointer"> <Link to="/login">log in</Link> </u> </> }>
                <LabelInput label="Email" type="text" name="email" error={emailError} errorMsg={errorMsg} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} />
                <div className="relative w-full">
                    <LabelInput label="Password" name="password" type={showPassword ? "text" : "password"} error={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={handlePasswordBlur} />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-6.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
                <LabelInput name="repeatPassword" label="Repeat password" type={showRepeatPassword ? "text" : "password"} error={repeatPasswordError} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} onBlur={handleRepeatPasswordBlur} />
            </Form>
        </div>
    )
}