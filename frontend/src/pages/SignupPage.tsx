import { Link } from "react-router-dom"
import { useState, FocusEvent } from "react"

export default function SignupPage() {
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [repeatPasswordError, setRepeatPasswordError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");

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
            <img className="w-30 mb-10" src="../public/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">Create your account in one simple step</p>
            <div className="signup-container w-100 bg-gray-700 border-solid border-white rounded-md">
                <div className="signup-header flex flex-row justify-center items-center py-3 text-xl font-bold">
                    <h2>Sign up</h2>
                </div>
                <form className="px-12 py-6" action="">
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Email</label>
                        <input className="border-1 rounded-sm w-full px-1 py-1 text-xs" type="text" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} />
                        {emailError && <p className="text-red-500 text-[10px] mt-1">{emailError}</p>}
                    </div>
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Password</label>
                        <input className="border-1 rounded-sm w-full px-2 py-1 text-xs" value={password} type="password" onChange={(e) => setPassword(e.target.value)} onBlur={handlePasswordBlur} />
                        {passwordError && <p className="text-red-500 text-[10px] mt-1">{passwordError}</p>}
                    </div>
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Repeat password</label>
                        <input className="border-1 rounded-sm w-full px-2 py-1 text-xs" value={repeatPassword} type="password" onChange={(e) => setRepeatPassword(e.target.value)} onBlur={handleRepeatPasswordBlur} />
                        {repeatPasswordError && <p className="text-red-500 text-[10px] mt-1">{repeatPasswordError}</p>}
                    </div>
                    <div className="signup-footer flex flex-col justify-center items-center py-3 mt-6">
                        <button className="cursor-pointer w-full hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white mb-2">Sign up</button>
                        <p className="text-xs">or <u className="cursor-pointer"><Link to="/login">log in</Link></u></p>
                    </div>
                </form>
            </div>
        </div>
    )
}