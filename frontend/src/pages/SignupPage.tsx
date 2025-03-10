import { Link } from "react-router-dom"
import { useState } from "react"

export default function SignupPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleBlur(e) {
        setPassword(e.target.value)
        validatePassword(password)
    }
    
    function validatePassword(password: string) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
        if (!passwordRegex.test(password)) {
            setError('Password must contain at least 1 uppercase letter, 1 number, and 1 special character, and be at least 8 characters long.');
          } else {
            setError('');
          }
        }

    return(
        <div className="login-page flex flex-row justify-center items-center font-mono text-white bg-black min-h-screen">
            <div className="login-container bg-gray-700 border-solid border-white rounded-md">
                <div className="login-header flex flex-row justify-center items-center py-3 text-xl font-bold">
                    <h2>Sign up</h2>
                </div>
                <form className="px-12 py-6" action="">
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Email</label>
                        <input className="border-1 rounded-sm w-50 px-1 py-1 text-xs" type="text" />
                    </div>
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Password</label>
                        <input className="border-1 rounded-sm w-50 px-2 py-1 text-xs" type="password" onBlur={handleBlur} />
                    </div>
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Repeat password</label>
                        <input className="border-1 rounded-sm w-50 px-2 py-1 text-xs" type="password" />
                    </div>
                    <div className="login-footer flex flex-col justify-center items-center py-3 mt-6">
                        <button className="cursor-pointer w-full hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white mb-2">Sign up</button>
                        <p className="text-xs">or <u className="cursor-pointer"><Link to="/login">log in</Link></u></p>
                    </div>
                </form>
            </div>
        </div>
    )
}