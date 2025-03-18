interface FormProps {
    buttonText: string;
  }

export default function Button({ buttonText }: FormProps) {
    return(
        <button className="cursor-pointer w-full hover:bg-gray-800 text-white px-4 py-1.5 rounded-sm text-sm border border-white mb-2">{buttonText}</button>
    )
}