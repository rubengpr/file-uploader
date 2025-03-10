import { Link } from "react-router-dom"

export default function LoginPage() {
    return(
        <div className="login-page flex flex-col justify-center items-center font-mono text-white bg-black min-h-screen">
            <img className="w-30 mb-6" src="../public/folded-logo.svg" alt="Folded logo" />
            <p className="mb-2">Welcome back to your file storage</p>
            <div className="login-container w-100 bg-gray-700 border-solid border-white rounded-md">
                <div className="login-header flex flex-row justify-center items-center py-3 text-xl font-bold">
                    <h2>Log in</h2>
                </div>
                <form className="px-12 py-6" action="">
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Email</label>
                        <input className="border-1 rounded-sm w-full px-1 py-1 text-xs" type="text" />
                    </div>
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-full" htmlFor="">Password</label>
                        <input className="border-1 rounded-sm w-full px-2 py-1 text-xs" type="password" />
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