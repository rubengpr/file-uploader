interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    inputSize: "sm" | "md" | "lg";
    handleInputChange: (value: string) => void;
}

export default function Input ({ inputSize, type, placeholder, value, handleInputChange }: InputProps) {
    const sizeClasses = {
        sm: "text-sm px-2 py-1",
        md: "text-base px-2 py-2",
        lg: "text-lg px-3 py-4",
      }[inputSize];
    
    return (
        <input
            className={`${sizeClasses} text-white text-xs border border-gray-400 rounded-sm caret-white focus:outline-none focus:ring focus:ring-white hover:border-white`}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)} />
    )
}