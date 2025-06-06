import { ReactNode, FormEventHandler } from 'react';
import Button from "./Button";

interface FormProps {
    title: string;
    buttonText: string;
    belowButton?: ReactNode;
    children: ReactNode;
    errorMsg?: string
    loading: boolean
    onSubmit: FormEventHandler<HTMLFormElement>;
  }

export default function Form({ children, title, buttonText, belowButton, errorMsg, loading, onSubmit }: FormProps) {
    return(
        <div className="w-100 bg-gray-700 border-solid border-white rounded-md text-white">
            <div className="flex flex-row justify-center items-center py-3 text-xl font-bold">
                <h2>{title}</h2>
            </div>
            <form className="px-12 py-6" onSubmit={onSubmit}>
                <div className="flex flex-col gap-3">
                    {children}
                </div>
                {errorMsg && <p className="text-red-400 text-xs mt-1 mb-1">{errorMsg}</p>}
                <div className="flex flex-col justify-center items-center py-3 mt-6">
                    <Button
                        type='submit'
                        loading={loading}
                        buttonText={buttonText} />
                    {belowButton && <p className="text-xs">{belowButton}</p>}
                </div>
            </form>
        </div>
    )
}