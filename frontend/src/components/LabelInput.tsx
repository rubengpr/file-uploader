interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    type: string;
    error?: string;
    errorMsg?: string;
  }

  export default function LabelInput({ label, type, error, errorMsg, name, ...props }: LabelInputProps) {
    return(
        <div className="flex flex-col justify-center w-full">
                <label className="text-white text-xs w-full mb-1 pl-0.5" htmlFor={name}>{label}</label>
                <input {...props} id={name} name={name} className="w-full px-1 py-1 text-white text-xs border border-gray-400 rounded-sm caret-white focus:outline-none focus:ring focus:ring-white hover:border-white" type={type} />
                {error && (<p className="text-red-400 text-[10px] mt-1">{error}</p>)}
                {errorMsg && (<p className="text-red-400 text-[10px] mt-1">{errorMsg}</p>)}
        </div>
    )
}