import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useState, FocusEvent } from "react"
import LabelInput from "../components/LabelInput"
import Form from "../components/Form"

export default function SignupPage() {
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

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

    return(
        <div className="signup-page flex flex-col justify-center items-center font-mono text-white bg-black min-h-screen">
            <Form title="Sign up" buttonText="Sign up" belowButton={ <> or{" "} <u className="cursor-pointer"> <Link to="/login">log in</Link> </u> </> }>
                <LabelInput label="Email" type="text" error={emailError} value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} />
                <div className="relative w-full">
                    <LabelInput label="Password" type={showPassword ? "text" : "password"} error={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={handlePasswordBlur} />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-6.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
                <LabelInput label="Repeat password" type={showRepeatPassword ? "text" : "password"} error={repeatPasswordError} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} onBlur={handleRepeatPasswordBlur} />
            </Form>
        </div>
    )
}