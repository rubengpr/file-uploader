import { faFolder, faFile, faUser } from "@fortawesome/free-solid-svg-icons"
import Button from "./Button"
import FeatureItem from "./FeatureItem"

interface CardProps {
    planType: string
    planPrice: string
    monthTag?: boolean
    folderLimit: string
    fileLimit: string
    userLimit: string
    button?: boolean
    planButtonCta?: string
    handlePlanClick?: () => void
}

export default function Card({ planType, planPrice, monthTag, folderLimit, fileLimit, userLimit, button, planButtonCta, handlePlanClick }: CardProps) {
    return(
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg px-6 py-6 min-w-80">
            <div className="min-h-20 mb-10 border-b border-neutral-700 pb-4">
                <h2 className="text-neutral-300 text-lg mb-3">{planType}</h2>
                <div className="flex flex-row items-end gap-1">
                    <p className="text-white text-4xl">{planPrice}</p>
                    {monthTag && <span className="text-neutral-300 text-base">/mo</span>}
                </div>
            </div>
            <div className="flex flex-col gap-2 mb-10">
                <FeatureItem icon={faFolder} text={folderLimit} />
                <FeatureItem icon={faFile} text={fileLimit} />
                <FeatureItem icon={faUser} text={userLimit} />
            </div>
            {button &&
                <Button
                buttonText={planButtonCta}
                type="button"
                onClick={handlePlanClick}
                />
            }
        </div>
    )
}