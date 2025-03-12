export default function Test() {
    const error1 = false
    const error2 = true
    
    return(
        <div className="flex flex-col justify-center items-center bg-gray-800 min-h-screen min-w-screen font-mono">
            <div className="flex flex-col justify-center items-center w-96 px-6 py-6 bg-gray-600 rounded-sm border gap-4">
                <div className="flex flex-col justify-center w-full px-4">
                    <label className="text-white text-xs w-full mb-1 pl-0.5" htmlFor="">Email</label>
                    <input className="w-full px-1.5 py-1 text-white text-xs border border-white rounded-sm caret-white focus:outline-none focus:ring focus:ring-white" type="text" />
                    {error1 && (<p className="text-red-500 text-[10px] mt-1">This is an error message</p>)}
                </div>
                <div className="flex flex-col justify-center w-full px-4">
                    <label className="text-white text-xs w-full mb-1 pl-0.5" htmlFor="">Email</label>
                    <input className="w-full px-1.5 py-1 text-white text-xs border border-white rounded-sm caret-white focus:outline-none focus:ring focus:ring-white" type="text" />
                    {error2 && (<p className="text-red-500 text-[10px] mt-1">This is an error message</p>)}
                </div>
            </div>
        </div>
    )
}