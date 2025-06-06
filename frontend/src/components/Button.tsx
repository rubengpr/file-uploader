import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

interface ButtonProps {
    disabled?: boolean;
    buttonText: string;
    type: 'button' | 'submit';
    onClick?: () => void;
    loading?: boolean;
}

export default function Button({ disabled, buttonText, type, onClick, loading }: ButtonProps) {
    return(
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className="flex items-center justify-center gap-2 cursor-pointer w-full hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white mb-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-inherit">
                {loading && (
                    <div className="animate-spin">
                        <FontAwesomeIcon icon={faSpinner} />
                    </div>
                )}
                {buttonText}
        </button>
    )
}