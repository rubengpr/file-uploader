import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Form from "../components/Form"
import LabelInput from "../components/LabelInput";
import { Link } from "react-router-dom";


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    
    return(
        <div className="login-page flex flex-col justify-center items-center font-mono text-white bg-black min-h-screen">
            <img className="w-30 mb-6" src="../public/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">Welcome back to your file storage</p>
            <Form title="Log in" buttonText="Log in" belowButton={ <> or{" "} <u className="cursor-pointer"> <Link to="/signup">sign up</Link> </u> </> }>
                <LabelInput label="Email" type="text" />
                <div className="relative w-full">
                    <LabelInput type={showPassword ? "text" : "password"} label="Password" />
                    <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-6.5 left-70 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                </div>
            </Form>
        </div>
    )
}