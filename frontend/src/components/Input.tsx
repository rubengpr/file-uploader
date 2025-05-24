interface InputProps {
    type: string;
    placeholder?: string;
    name?: string;
    id?: string;
    value: string;
    inputSize: "sm" | "md" | "lg";
    onChange: (value: string) => void;
}

export default function Input ({ inputSize, type, placeholder, value, name, id, onChange }: InputProps) {
    const sizeClasses = {
        sm: "text-sm px-2 py-1",
        md: "text-base px-2 py-2",
        lg: "text-lg px-3 py-4",
      }[inputSize];
    
    return (
        <input
            className={`${sizeClasses} text-white border border-gray-400 rounded-sm caret-white focus:outline-none focus:ring focus:ring-white hover:border-white`}
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)} />
    )
}