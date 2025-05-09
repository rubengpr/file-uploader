import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ButtonProps {
    text: string;
    icon: IconDefinition;
    handleFilterClick: () => void;
}

export default function ButtonTable({ text, icon, handleFilterClick }: ButtonProps) {
    return(
        <div onClick={handleFilterClick} className="px-4 py-1 rounded-3xl hover:bg-neutral-800 justify-center items-center cursor-pointer transition-colors duration-300 ease-in-out">
            <FontAwesomeIcon icon={icon} className='text-white' />
            <button className="pl-2 text-sm text-white cursor-pointer">{text}</button>
        </div>
    )
}