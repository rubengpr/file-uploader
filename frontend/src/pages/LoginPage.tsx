import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
import LabelInput from "../components/LabelInput"


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => setShowPassword(prev => !prev);

    
    return(
        <div className="login-page flex flex-col justify-center items-center font-mono text-white bg-black min-h-screen">
            <img className="w-30 mb-6" src="../public/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">Welcome back to your file storage</p>
            <div className="login-container w-100 bg-gray-700 border-solid border-white rounded-md">
                <div className="login-header flex flex-row justify-center items-center py-3 text-xl font-bold">
                    <h2>Log in</h2>
                </div>
                <form className="px-12 py-6" action="">
                    <div className="flex flex-col gap-3">
                        <LabelInput type="text" label="Email"/>
                        <div className="flex flex-col justify-center items-start mb-3">
                            <div className="relative w-full">
                                <LabelInput type={showPassword ? "text" : "password"} label="Password" />
                                <FontAwesomeIcon onClick={toggleShowPassword} className="text-xs absolute top-6.5 left-65 cursor-pointer" icon={showPassword ? faEye : faEyeSlash} />
                            </div>
                        </div>
                    </div>
                    <div className="login-footer flex flex-col justify-center items-center py-3 mt-6">
                        <button className="cursor-pointer w-full hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white mb-2">Log in</button>
                        <p className="text-xs">or <u className="cursor-pointer"><Link to="/signup">sign up</Link></u></p>
                    </div>
                </form>
            </div>
        </div>
    )
}