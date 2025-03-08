export default function LoginPage() {
    return(
        <div className="login-page flex flex-row justify-center items-center font-mono text-white bg-black min-h-screen">
            <div className="login-container bg-gray-700 border-solid border-white rounded-md">
                <div className="login-header flex flex-row justify-center items-center py-3 text-xl font-bold">
                    <h2>Log in</h2>
                </div>
                <form className="px-10 py-6" action="">
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-16" htmlFor="">Email</label>
                        <input className="border-1 rounded-sm w-50 px-1 py-1 text-xs" type="text" />
                    </div>
                    <div className="flex flex-col justify-center items-start mb-3">
                        <label className="text-xs w-16" htmlFor="">Password</label>
                        <input className="border-1 rounded-sm w-50 px-2 py-1 text-xs" type="password" />
                    </div>
                    <div className="login-footer flex flex-col justify-center items-center py-3">
                        <button className="cursor-pointer hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white mb-2">Log in</button>
                        <p className="text-xs">or <u className="cursor-pointer">sign up</u></p>
                    </div>
                </form>
            </div>
        </div>
    )
}