interface FormProps {
    disabled?: boolean;
    buttonText: string;
    onClick?: () => void;
  }

export default function Button({ disabled, buttonText, onClick }: FormProps) {
    return(
        <button disabled={disabled} onClick={onClick} className="cursor-pointer w-full hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white mb-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-inherit">{buttonText}</button>
    )
}