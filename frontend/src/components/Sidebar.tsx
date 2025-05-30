import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { isDisabled } from '@/utils/disabled';
import { Toaster } from 'react-hot-toast';
import LabelInput from './LabelInput';
import Button from './Button';
import Modal from './Modal';
import SidebarOption from './SidebarOption'
import useFileOperations from '@/hooks/useFileOperations';
import useCreateFolder from '@/hooks/folders/useCreateFolder';

export default function Sidebar({ onUploadSuccess }: { onUploadSuccess: () => void }) {

    const { folderId } = useParams<{ folderId: string }>();
    
    const { handleFileChange } = useFileOperations();
    const { createFolder, newFolderName, setNewFolderName, isNewFolderModalOpen, setIsNewFolderModalOpen } = useCreateFolder({ onUploadSuccess })
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleNewFileClick = () => {
        fileInputRef.current?.click()
    }
    
    return(
        <div className='sidebar flex flex-col w-50 bg-black px-2 py-4 border-r border-gray-700 gap-1'>
            <SidebarOption onClick={handleNewFileClick} icon={faFile} text="New file" />
            <SidebarOption onClick={() => setIsNewFolderModalOpen(true)} icon={faFolder} text="New folder" />
            <input onChange={(e) => handleFileChange(e, folderId, onUploadSuccess)} ref={fileInputRef} className='hidden' type="file" accept='.doc, .docx, .xls, .xlsx, .csv, .txt, .pdf, image/*' />
            <Toaster />
            {isNewFolderModalOpen && (
                <Modal
                    modalTitle='Create folder'
                    modalText='Select the new name for your folder. You can rename the folder name later.'
                    onClose={() => {
                        setIsNewFolderModalOpen(false);
                        setNewFolderName('');
                    }}
                    >
                {
                    <>
                        <div className='mb-6'>
                            <LabelInput inputSize='sm' onValueChange={setNewFolderName} type='text' label='New folder name' name='newFolderName' />
                        </div>
                        <div className="flex flex-row gap-4">
                            <Button
                                type='button'
                                buttonText='Cancel'
                                onClick={() => {
                                setIsNewFolderModalOpen(false)
                                setNewFolderName("");
                                }}
                            />
                            <Button
                                type='button'
                                disabled={isDisabled(newFolderName)}
                                buttonText='Create folder'
                                onClick={createFolder}
                            />
                        </div>
                    </>
                }
                </Modal>
            )}
        </div>
    )
}