import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

interface SidebarOptionProps {
    icon: IconProp,
    text: string,
    onClick?: () => void
}

export default function SidebarOption({ icon, text, onClick }: SidebarOptionProps) {
    return(
        <div onClick={onClick} className='group flex flex-row justify-start items-center px-3 py-1 gap-2 cursor-pointer rounded-sm hover:bg-neutral-800 transition'>
            <div className='w-4'>
                <FontAwesomeIcon className='text-white' icon={icon} />
            </div>
            <p className='text-neutral-300 group-hover:translate-x-0.5 group-hover:text-white text-sm transition'>{text}</p>
        </div>
    )
}