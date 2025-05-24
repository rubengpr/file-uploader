import { InputHTMLAttributes } from "react";

interface LabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name?: string;
    type: string;
    error?: string;
    errorMsg?: string;
    inputSize: "sm" | "md" | "lg";
    onValueChange?: (value: string) => void;
  }

  export default function LabelInput({ label, inputSize, type, error, errorMsg, name, onValueChange, ...props }: LabelInputProps) {
    const sizeClasses = {
      sm: "text-xs px-2 py-1",
      md: "text-xs px-2 py-2",
      lg: "text-lg px-3 py-4",
    }[inputSize];
    
    return(
      <div className="flex flex-col justify-center w-full text-white">
        <label className= "text-xs mb-1 pl-0.5" htmlFor={name}>{label}</label>
        <input
          {...props}
          onChange={(e) => {
            props.onChange?.(e); // native onChange, if passed
            onValueChange?.(e.target.value); // our custom handler
            }}
        id={name}
        name={name}
        className={`${sizeClasses} border border-gray-400 rounded-sm caret-white focus:outline-none focus:ring focus:ring-white hover:border-white`}
        type={type}
        />
          
        {error && (<p className="text-red-400 text-[10px] mt-1">{error}</p>)}
        {errorMsg && (<p className="text-red-400 text-[10px] mt-1">{errorMsg}</p>)}
      </div>
    )
}