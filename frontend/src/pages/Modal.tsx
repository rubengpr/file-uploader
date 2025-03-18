interface FormProps {
    children: React.ReactNode;
  }

export default function Modal({ children }: FormProps) {
    return(
        <div className="modal-container bg-gray-700 flex flex-col justify-center items-center px-10 py-8 rounded-md">
            <h1 className="text-3xl mb-4">This is the modal title</h1>
            <p className="text-xs w-140 text-center">This is the modal text. It should be a very long text, so just in case.</p>
            <div className="py-4">
                {children}
            </div>
        </div>
    )
}