interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    handleInputChange: (value: string) => void;
}

export default function Input ({ type, placeholder, value, handleInputChange }: InputProps) {
    return (
        <input
            className="px-1 py-1 text-white text-xs border border-gray-400 rounded-sm caret-white focus:outline-none focus:ring focus:ring-white hover:border-white"
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)} />
    )
}