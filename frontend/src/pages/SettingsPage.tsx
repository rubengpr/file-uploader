import MainLayout from "./MainLayout"

export default function SettingsPage() {
    return(
        <MainLayout>
            <div className="flex flex-row">
                <div className="w-1/4 flex flex-col h-screen px-10 py-8 text-white border-r border-neutral-700">
                    <h1 className="text-6xl mb-10">Settings</h1>
                </div>
                <div className="w-3/4 flex flex-col h-screen mt-6 px-10">
                    <p className="text-white mb-4">Subscription</p>
                    <div className="flex flex-col justify-content bg-neutral-900 border border-neutral-700 rounded-md px-5">
                        <div className="flex flex-row justify-between items-center border-b border-neutral-700 px-2 py-4">
                            <div className="flex flex-col">
                                <p className="text-white text-lg">Free</p>
                                <span className="text-neutral-400 text-sm">5 files, 1 user and unlimited folders</span>
                            </div>
                            <button className="text-white text-sm border px-4 py-1 bg-neutral-900 rounded-4xl hover:cursor-pointer hover:bg-neutral-800">Get Free</button>
                        </div>
                        <div className="flex flex-row justify-between items-center border-b border-neutral-700 px-2 py-4">
                            <div className="flex flex-col">
                                <p className="text-white text-lg">Standard</p>
                                <span className="text-neutral-400 text-sm">20 files, 3 users and unlimited folders</span>
                            </div>
                            <button className="text-white text-sm border px-4 py-1 bg-neutral-900 rounded-4xl hover:cursor-pointer hover:bg-neutral-800">Get Standard</button>
                        </div>
                        <div className="flex flex-row justify-between items-center px-2 py-4">
                            <div className="flex flex-col">
                                <p className="text-white text-lg">Max</p>
                                <span className="text-neutral-400 text-sm">Unlimited everything</span>
                            </div>
                            <button className="text-white text-sm border px-4 py-1 bg-neutral-900 rounded-4xl hover:cursor-pointer hover:bg-neutral-800">Get Max</button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}