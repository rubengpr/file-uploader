import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faFolder, faUser } from '@fortawesome/free-solid-svg-icons'
import Button from "@/components/Button"
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "@/utils/auth"

export default function PricingPage() {
    const navigate = useNavigate()
    
    const handlePlanSelection = () => {
        if (!isAuthenticated()) {
            navigate('/login')
            return
        }

        navigate('/settings')
    }

    return(
        <div className="bg-black min-h-screen">
            <nav className="navbar w-full h-14 flex items-center p-8">
                <div className="w-full h-full flex justify-start items-center">
                    <img className="w-28 h-auto pr-6" src="/folded-logo.svg" alt="Website logo" />
                </div>
                <div className="w-full h-full flex justify-center items-center">
                    <Link to="/">
                        <p className="px-4 py-2 rounded-sm text-white hover:cursor-pointer hover:bg-neutral-800">Home</p>
                    </Link>
                </div>
                <div className="w-full h-full flex justify-end items-center">
                    <button className="cursor-pointer hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white"><Link to="/login">Log in</Link></button>
                </div>
            </nav>
            <div className="flex flex-row w-full mt-10 justify-center items-center mb-20">
                <h1 className="text-5xl font-bold text-white mb-6 tracking-tighter">Storage plans for all use cases</h1>
            </div>
            <div className="flex flex-row justify-center gap-4 mb-16">
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-6 py-6 min-w-80">
                    <div className="min-h-20 mb-10 border-b border-neutral-700 pb-4">
                        <h2 className="text-neutral-300 text-lg mb-3">Hobby</h2>
                        <p className="text-white text-4xl">Free</p>
                    </div>
                    <div className="flex flex-col gap-2 mb-10">
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faFolder} />
                            <p className='text-white'>Unlimited folders</p>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faFile} />
                            <p className='text-white'>5 files</p>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faUser} />
                            <p className='text-white'>1 user</p>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-6 py-6 min-w-80">
                    <div className="min-h-20 mb-10 border-b border-neutral-700 pb-4">
                        <h2 className="text-neutral-300 text-lg mb-3">Standard</h2>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white text-4xl">5€</p>
                            <span className="text-neutral-400">/mo</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-10">
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faFolder} />
                            <p className='text-white'>Unlimited folders</p>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faFile} />
                            <p className='text-white'>50 files</p>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faUser} />
                            <p className='text-white'>3 users</p>
                        </div>
                    </div>
                    <Button
                    buttonText="Get Starter"
                    type="button"
                    onClick={handlePlanSelection}
                    />
                </div>
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-6 py-6 min-w-80">
                    <div className="min-h-20 mb-10 border-b border-neutral-700 pb-4">
                        <h2 className="text-neutral-300 text-lg mb-3">Max</h2>
                        <div className="flex items-baseline gap-2">
                            <p className="text-white text-4xl">20€</p>
                            <span className="text-neutral-400">/mo</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mb-10">
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faFolder} />
                            <p className='text-white'>Unlimited folders</p>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faFile} />
                            <p className='text-white'>Unlimited files</p>
                        </div>
                        <div className='flex flex-row items-center gap-2'>
                            <FontAwesomeIcon className='text-white w-4' icon={faUser} />
                            <p className='text-white'>Unlimited users</p>
                        </div>
                    </div>
                    <Button
                    buttonText="Get Max"
                    type="button"
                    onClick={handlePlanSelection}
                    />
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <p className="text-white">Need an enterprise plan? <span className="underline cursor-pointer">Contact us</span>. Otherwise we won't believe it is real. Why would you pay for this?</p>
            </div>
        </div>
    )
}