import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareFromSquare, faCircleDown, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { AppFile } from './Table';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toast'
import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import LabelInput from './LabelInput';
import { downloadBlob } from '../utils/downloadBlob'
import supabase from '../utils/supabaseClient';

interface OptionsMenuProps {
    file: AppFile;
    onUpdate: () => void;
  }

export default function OptionsMenu({ file, onUpdate }: OptionsMenuProps) {
    
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [newFileName, setNewFileName] = useState("");

    const handleRename = async (file: AppFile) => {
        //Get old file name, from the file.name id
        const oldFileName = file.name
        const userId = file.createdBy
        const fileId = file.id;
        const newFilePath = `${userId}/${newFileName}`;
        
        //Copy file on Supabase storage
        const { error } = await supabase.storage.from('files').copy(`${userId}/${oldFileName}`, `${newFilePath}`);

        //Delete file with old name on Supabase storage
        if (!error) {
            await supabase.storage.from('files').remove([`${userId}/${oldFileName}`]);

            //Update file name on database
            try {
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/file/rename`, { fileId, newFileName });
                showSuccessToast(response.data.message);
                onUpdate();
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                    showErrorToast(message);
                } else {
                    showErrorToast("Unexpected error occurred.");
                }
            }
    }
    setIsRenameModalOpen(false);

};

const handleDelete = async (file: AppFile) => {
    const fileId = file.id
    const fileName = file.name
    const userId = file.createdBy

    //Delete file on Supabase Storage
    const { error } = await supabase.storage.from('files').remove([`${userId}/${fileName}`]);

    //Delete file from database
    if (!error) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/file/delete`, { data: { fileId, userId } });
            showSuccessToast(response.data.message);
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                showErrorToast(message);
            } else {
                showErrorToast("Unexpected error occurred.");
            }
        }
        setIsConfirmModalOpen(false);
        onUpdate();
    }

}

const handleDownload = async () => {
    const userId = file.createdBy
    const fileName = file.name

    const { data, error } = await supabase.storage.from('files').download(`${userId}/${fileName}`);

    if (error) {
        showErrorToast(error.message);
    }

    if (data) {
        downloadBlob(data, `${fileName}`);
        showSuccessToast("File downloaded successfully");
    } else {
        showErrorToast("Failed to download the file.");
    }
}

    return(
        <>
            <div className='z-1 absolute min-w-26 top-8 right-10 rounded-xs text-[10px] flex flex-col items-center justify-center bg-neutral-50'>
                <div className='w-full flex flex-row justify-start items-center py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faShareFromSquare} />
                    <p>Share</p>
                </div>
                <div onClick={handleDownload} className='w-full flex flex-row justify-start items-center top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faCircleDown} />
                    <p>Download</p>
                </div>
                <div onClick={() => setIsRenameModalOpen(true)} className='w-full flex flex-row justify-start items-center top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <p>Rename</p>
                </div>
                <div onClick={() => setIsConfirmModalOpen(true)} className='w-full flex flex-row justify-start items-center top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faTrash} />
                    <p>Delete</p>
                </div>
            </div>

            {isRenameModalOpen && (<Modal modalTitle='Rename file' modalText='Select the new name for your file. This will change the name of your file.'>
                {
                    <>
                        <div className='mb-6'>
                            <LabelInput onValueChange={setNewFileName} type='text' label='New name' name='newFileName' />
                        </div>
                        <Button buttonText='Save' onClick={() => handleRename(file)} />
                    </>
                }
            </Modal>)}
            {isConfirmModalOpen && (<Modal modalTitle='Delete file' modalText='Are you sure you want to delete this file? You will not be able to recover it.' >
                {
                    <div className='flex flex-row gap-4'>
                        <Button buttonText='Cancel' onClick={() => setIsConfirmModalOpen(false)} />
                        <Button buttonText='Delete' onClick={() => handleDelete(file)} />
                    </div>
                }
            </Modal>)}
        </>
        
    )
}