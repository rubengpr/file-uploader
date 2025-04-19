import Form from "../components/Form"
import LabelInput from "../components/LabelInput"
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {

    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [token, setToken] = useState<string | null>(null);
    
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    useEffect(() => {
        const t = new URLSearchParams(window.location.search).get("t");
        setToken(t);
      }, []);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
        setShowRepeatPassword(!showRepeatPassword)
    }

    const handlePasswordBlur = () => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
        if(!passwordRegex.test(password)) {
            setPasswordError("One capital letter, number and special character")
        } else {
            setPasswordError("")
        }
    }

    const handleRepeatPasswordBlur = () => {
        if(password != repeatPassword) {
            setRepeatPasswordError("Passwords don't match")
        } else {
            setRepeatPasswordError("")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, { password, token });

            const { authToken } = response.data;
            localStorage.setItem('token', authToken);

            navigate('/folders');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Something went wrong. Please, try again.";
                setErrorMsg(message);
            } else {
                setErrorMsg("Unexpected error occurred.");
            }
        }
    }
    
    return(
        <div className="login-page flex flex-col justify-center items-center text-white bg-black min-h-screen">
            <Form errorMsg={errorMsg} title="Change password" buttonText="Change password" handleSubmit={handleSubmit}>
                <p className="text-xs text-center">You can now set your new password</p>
                <div className="relative w-full">
                    <LabelInput label="Password" name="password" type={showPassword ? "text" : "password"} error={passwordError} value={password} onChange={(e) => setPassword(e.target.value)} onBlur={handlePasswordBlur} />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-6.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
                <LabelInput name="repeatPassword" label="Repeat password" type={showRepeatPassword ? "text" : "password"} error={repeatPasswordError} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} onBlur={handleRepeatPasswordBlur} />
            </Form>
        </div>
    )
}