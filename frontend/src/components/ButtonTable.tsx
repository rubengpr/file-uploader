import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ButtonTableProps {
    text: string;
    icon: IconDefinition;
    onClick: () => void;
}

export default function ButtonTable({ text, icon, onClick }: ButtonTableProps) {
  return (
    <button
        type='button'
        onClick={onClick}
        className="flex flex-row items-center px-4 py-1 rounded-3xl hover:bg-neutral-800 justify-center cursor-pointer transition-colors duration-300 ease-in-out"
    >
        <FontAwesomeIcon icon={icon} className="text-white" />
        <span className="pl-2 text-sm text-white">{text}</span>
    </button>
  );
}