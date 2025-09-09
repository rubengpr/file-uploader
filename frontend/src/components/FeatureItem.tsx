import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"

interface FeatureItemProps {
    icon: IconDefinition
    text: string
}

export default function FeatureItem({ icon, text }: FeatureItemProps) {
    return (
        <div className='flex flex-row items-center gap-2'>
            <FontAwesomeIcon className='text-white w-4' icon={icon} />
            <p className='text-white'>{text}</p>
        </div>
    )
}
