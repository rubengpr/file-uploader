export default function LoginPage() {
    return(
        <div className="login-page font-mono bg-black min-h-screen">
            <div className="login-container w-40 h-40 bg-gray-700 border-solid border-white rounded-md">
                <form action="">
                    <div>
                        <label htmlFor="">Email</label>
                        <input type="text" />
                    </div>
                    <div>
                        <label htmlFor="">Password</label>
                        <input type="text" />
                    </div>
                    <button>Log in</button>
                </form>
            </div>
        </div>
    )
}