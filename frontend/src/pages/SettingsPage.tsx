import MainLayout from "./MainLayout"
import axios from "axios";
import { showErrorToast } from "@/utils/toast";
import useUser from "@/stores/useUser";
import { useEffect } from "react";
import Tag from "@/components/Tag";

const handleSubscription = async (planType, userId) => {

    try {
        const token = localStorage.getItem("token")
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, 
            { planType, userId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        if (response.data.url) {
            window.location.href = response.data.url;
        }
    } catch(error) {
        if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Error creating checkout session.";
            showErrorToast(message);
        } else {
            showErrorToast("Unexpected error occurred.");
        }
    }
}

export default function SettingsPage() {
    const { userId, currentPlan } = useUser()

    useEffect(() => {
        const getUser = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const user = response.data.user
                useUser.getState().setUser(user)

            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error
                    showErrorToast(message)
                } else {
                    showErrorToast("Unexpected error occurred")
                }
            }
        }

        getUser()
    }, [])

    return(
        <MainLayout>
            <div className="flex flex-row">
                <div className="w-1/4 flex flex-col h-screen px-10 py-8 text-white border-r border-neutral-700">
                    <h1 className="text-6xl mb-10">Settings</h1>
                </div>
                <div className="w-3/4 flex flex-col h-screen mt-6 px-10">
                    <p className="text-white mb-4">Subscription</p>
                    <div className="flex flex-col bg-neutral-900 border border-neutral-700 rounded-md px-5">
                        <div className="flex flex-row justify-between items-center border-b border-neutral-700 px-2 py-4">
                            <div className="flex flex-col">
                                <p className="text-white text-lg">Free</p>
                                <span className="text-neutral-400 text-sm">5 files, 1 user and unlimited folders</span>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-4">
                                {currentPlan === 'free' && (
                                    <Tag />
                                )}
                                <button disabled={currentPlan === 'free'} className="text-white text-sm border px-4 py-1 bg-neutral-900 rounded-full hover:cursor-pointer hover:bg-neutral-800 disabled:bg-neutral-700 disabled:text-neutral-400 disabled:hover:cursor-not-allowed">Get Free</button>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center border-b border-neutral-700 px-2 py-4">
                            <div className="flex flex-col">
                                <p className="text-white text-lg">Standard</p>
                                <span className="text-neutral-400 text-sm">20 files, 3 users and unlimited folders</span>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-4">
                                {currentPlan === 'standard' && (
                                    <Tag />
                                )}
                                <button disabled={currentPlan === 'standard'} onClick={() => handleSubscription('standard', userId)} className="text-white text-sm border px-4 py-1 bg-neutral-900 rounded-full hover:cursor-pointer hover:bg-neutral-800 disabled:bg-neutral-700 disabled:text-neutral-400 disabled:hover:cursor-not-allowed">Get Standard</button>
                            </div>
                        </div>
                        <div className="flex flex-row justify-between items-center px-2 py-4">
                            <div className="flex flex-col">
                                <p className="text-white text-lg">Max</p>
                                <span className="text-neutral-400 text-sm">Unlimited everything</span>
                            </div>
                            <div className="flex flex-row justify-center items-center gap-4">
                                {currentPlan === 'max' && (
                                    <Tag />
                                )}
                                <button disabled={currentPlan === 'max'} onClick={() => handleSubscription('max', userId)} className="text-white text-sm border px-4 py-1 bg-neutral-900 rounded-full hover:cursor-pointer hover:bg-neutral-800 disabled:bg-neutral-700 disabled:text-neutral-400 disabled:hover:cursor-not-allowed">Get Max</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}