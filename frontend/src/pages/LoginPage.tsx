import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom";
import Form from "@/components/Form"
import LabelInput from "@/components/LabelInput";
import { isAuthenticated } from "@/utils/auth";
import axios from 'axios'
import useUser from '@/stores/useUser';

export default function LoginPage() {

    const { userId, setUserId } = useUser()
    
    const navigate = useNavigate();
    
    useEffect(() => {
        if (isAuthenticated()) {
          navigate("/folders");
        }
      }, [navigate]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setErrorMsg("")

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password }, { withCredentials: true });

            const { token, stoken, userId } = response.data;
            setUserId(userId)
            
            localStorage.setItem('token', token);
            localStorage.setItem('stoken', stoken);

            navigate('/folders');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                setErrorMsg(message);
            } else {
                setErrorMsg("Unexpected error occurred.");
            }
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/get/${userId}`)
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