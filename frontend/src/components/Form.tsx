import { useState, ReactNode, FormEventHandler } from 'react';
import Button from "./Button";

interface FormProps {
    title: string
    buttonText: string
    belowButton?: ReactNode
    children: ReactNode
    errorMsg?: string
    onSubmit: FormEventHandler<HTMLFormElement>;
  }

export default function Form({ children, title, buttonText, belowButton, errorMsg, onSubmit }: FormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await onSubmit(e)
        } finally {
            setIsLoading(false)
        }
    }
    
    return(
        <div className="w-100 bg-gray-700 border-solid border-white rounded-md text-white">
            <div className="flex flex-row justify-center items-center py-3 text-xl font-bold">
                <h2>{title}</h2>
            </div>
            <form className="px-12 py-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-3">
                    {children}
                </div>
                {errorMsg && <p className="text-red-400 text-xs mt-1 mb-1">{errorMsg}</p>}
                <div className="flex flex-col justify-center items-center py-3 mt-6">
                    <Button
                        type='submit'
                        loading={isLoading}
                        buttonText={buttonText} />
                    {belowButton && <p className="text-xs">{belowButton}</p>}
                </div>
            </form>
        </div>
    )
}