interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type: string;
    error?: string;
  }

  export default function LabelInput({ label, type, error, ...props }: LabelInputProps) {
    return(
        <div className="flex flex-col justify-center w-full px-4">
                <label className="text-white text-xs w-full mb-1 pl-0.5" htmlFor="">{label}</label>
                <input {...props} className="w-full px-1 py-1 text-white text-xs border border-white rounded-sm caret-white focus:outline-none focus:ring focus:ring-white" type={type} />
                {error && (<p className="text-red-500 text-[10px] mt-1">{error}</p>)}
        </div>
    )
}