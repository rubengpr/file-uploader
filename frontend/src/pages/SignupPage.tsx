import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect, FormEvent } from "react"
import LabelInput from "@/components/LabelInput"
import Form from "@/components/Form"
import { isAuthenticated } from "@/utils/auth"
import axios from 'axios';
import { validateEmail, validatePassword } from '@/utils/validation'

export default function SignupPage() {
    
    const navigate = useNavigate();
        
        useEffect(() => {
            if (isAuthenticated()) {
              navigate("/folders");
            }
          }, [navigate]);
    
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)

    function toggleShowPassword() {
        setShowPassword(prev => !prev);
        setShowRepeatPassword(prev => !prev)
    }

    function validateRepeatPassword(repeatPassword: string) {
        if (password !== repeatPassword) {
            setRepeatPasswordError("Passwords don't match")
            return false
        } else {
            setRepeatPasswordError("")
            return true
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        const emailIsValid = validateEmail(email)
        setEmailError("")
        if (!emailIsValid) {
            setEmailError("Should be a valid email address")
            return false
        }

        const passwordIsValid = validatePassword(password)
        setPasswordError("")
        if (!passwordIsValid) {
            setPasswordError("One capital letter, number and special character")
            return false
        }

        const repeatPasswordIsValid = validateRepeatPassword(repeatPassword)

        if (!emailIsValid || !passwordIsValid || !repeatPasswordIsValid) {
            return
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, { email, password });

            const { token } = response.data
            localStorage.setItem('token', token);

            navigate('/folders');
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
            <Form
                onSubmit={handleSubmit}
                title="Sign up"
                buttonText="Sign up"
                belowButton={ <> or{" "} <u className="cursor-pointer"> <Link to="/login">log in</Link> </u> </> }
                >
                <LabelInput inputSize="md" label="Email" type="text" name="email" error={emailError} errorMsg={errorMsg} value={email} onChange={(e) => setEmail(e.target.value)} />
                <div className="relative w-full">
                    <LabelInput inputSize="md" label="Password" name="password" type={showPassword ? "text" : "password"} error={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-7.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
                <LabelInput inputSize="md" name="repeatPassword" label="Repeat password" type={showRepeatPassword ? "text" : "password"} error={repeatPasswordError} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
            </Form>
        </div>
    )
}