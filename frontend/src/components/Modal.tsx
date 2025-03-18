interface FormProps {
    modalTitle: string;
    modalText: string;
    children: React.ReactNode;
  }

export default function Modal({ modalTitle, modalText, children }: FormProps) {
    return(
        <div className="modal-container bg-gray-700 flex flex-col justify-center items-center px-10 py-8 rounded-md">
            <h1 className="text-3xl mb-4">{modalTitle}</h1>
            <p className="text-xs w-140 text-center">{modalText}</p>
            <div className="py-4">
                {children}
            </div>
        </div>
    )
}