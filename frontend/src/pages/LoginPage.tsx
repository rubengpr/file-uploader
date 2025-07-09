import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom";
import Form from "@/components/Form"
import LabelInput from "@/components/LabelInput";
import { isAuthenticated } from "@/utils/auth";
import axios from 'axios'
import useUser from '@/stores/useUser';

export default function LoginPage() {
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        if (isAuthenticated()) {
          navigate("/folders", { replace: true });
        }
    }, [navigate]);

    const TEST_EMAIL = "beffjezos@atmyzone.com"
    const TEST_PASSWORD = "Amazonia12!"

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMsg("")

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password }, { withCredentials: true })

            const { token, stoken } = response.data
            localStorage.setItem('token', token)
            localStorage.setItem('stoken', stoken)

            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const user = response.data.user
                useUser.getState().setUser(user)
        
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Error getting the files.";
                    setErrorMsg(message);
                } else {
                    setErrorMsg("Unexpected error occurred.");
                }
            }

            navigate('/folders')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again."
                setErrorMsg(message)
            } else {
                setErrorMsg("Unexpected error occurred.")
            }
        }
    }

    const handleLoginTestAccount = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email: TEST_EMAIL, password: TEST_PASSWORD }, { withCredentials: true })

            const { token, stoken } = response.data
            localStorage.setItem('token', token)
            localStorage.setItem('stoken', stoken)

            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const user = response.data.user
                useUser.getState().setUser(user)
        
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Error getting the files.";
                    setErrorMsg(message);
                } else {
                    setErrorMsg("Unexpected error occurred.");
                }
            }

            navigate('/folders')
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again."
                setErrorMsg(message)
            } else {
                setErrorMsg("Unexpected error occurred.")
            }
        } finally {
            setIsLoading(false)
        }
    }
    
    return(
        <div className="login-page flex flex-col justify-center items-center text-white bg-black min-h-screen">
            <img className="w-30 mb-6" src="/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">Welcome back to your file storage</p>
            <Form
                errorMsg={errorMsg}
                onSubmit={handleSubmit}
                title="Log in"
                buttonText="Log in"
                belowButton={ <> or{" "} <u className="cursor-pointer"> <Link to="/signup">sign up</Link> </u> </> }
                >
                <button
                    type='button'
                    onClick={handleLoginTestAccount}
                    disabled={isLoading}
                    className="font-bold flex items-center justify-center gap-2 cursor-pointer w-full hover:bg-gray-800 text-white px-4 py-1.5 rounded-full text-sm border border-white mb-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-inherit">
                    {isLoading && (
                        <div className="animate-spin">
                            <FontAwesomeIcon icon={faSpinner} />
                        </div>
                    )}
                    ✨ Use test account
                </button>
                <LabelInput inputSize="md" label="Email" name="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                <div className="relative w-full">
                    <LabelInput inputSize="md" type={showPassword ? "text" : "password"} name="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-7.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
                <u className="cursor-pointer text-xs"> <Link to="/recover-password">Forgot your password, again?</Link> </u>
            </Form>
        </div>
    )
}