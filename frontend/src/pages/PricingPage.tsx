import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { isAuthenticated } from "@/utils/auth"
import Card from "@/components/Card"

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
                <Card
                planType="Hobby"
                planPrice="Free"
                folderLimit='Unlimited folders'
                fileLimit='5 files'
                userLimit='1 user'
                />
                <Card
                planType="Standard"
                planPrice="5€"
                monthTag
                folderLimit='Unlimited folders'
                fileLimit='50 files'
                userLimit='3 users'
                button
                handlePlanClick={handlePlanSelection}
                planButtonCta="Get Standard"
                />
                <Card
                planType="Max"
                planPrice="20€"
                monthTag
                folderLimit='Unlimited folders'
                fileLimit='Unlimited files'
                userLimit='Unlimited users'
                button
                handlePlanClick={handlePlanSelection}
                planButtonCta="Get Max"
                />
            </div>
            <div className="flex flex-row justify-center items-center">
                <p className="text-white">Need an enterprise plan? <span className="underline cursor-pointer">Contact us</span>. Otherwise we won't believe it is real. Why would you pay for this?</p>
            </div>
        </div>
    )
}