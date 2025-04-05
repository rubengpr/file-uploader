interface FormProps {
    modalTitle: string;
    modalText: string;
    children: React.ReactNode;
  }

export default function Modal({ modalTitle, modalText, children }: FormProps) {
    return(
        <>
            <div className="fixed inset-0 bg-black/50 z-40"></div>
            <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
                <div className="p-6 rounded-lg shadow-lg bg-neutral-700 flex flex-col justify-center items-center">
                    <h1 className="text-3xl mb-4 font-bold">{modalTitle}</h1>
                    <p className="text-xs w-140 text-center">{modalText}</p>
                    <div className="py-4 w-1/2">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}