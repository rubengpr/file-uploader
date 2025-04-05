import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShareFromSquare, faCircleDown, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { createSupabaseClientWithAuth } from '../utils/supabaseClientWithAuth';
import { AppFile } from './Table';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toast'
import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import LabelInput from './LabelInput';

interface OptionsMenuProps {
    file: AppFile;
    onUpdate: () => void;
  }

export default function OptionsMenu({ file, onUpdate }: OptionsMenuProps) {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    
    const stoken = localStorage.getItem('stoken');
    const supabase = createSupabaseClientWithAuth(stoken || '');

    const handleRename = async (file: AppFile) => {
        //Get old file name, from the file.name id
        const oldFileName = file.name
        const userId = file.createdBy
        const fileId = file.id;
        
        
        //Copy file on Supabase storage
        const { error } = await supabase.storage.from('files').copy(`${userId}/${oldFileName}`, `${userId}/${newFileName}`);

        //Delete file with old name on Supabase storage
        if (!error) {
            await supabase.storage.from('files').remove([`${userId}/${oldFileName}`]);

            //Update file name on database
            try {
                const response = await axios.patch('http://localhost:4000/api/file/rename', { fileId, newFileName });
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
    setIsModalOpen(false);

};

    return(
        <>
            <div className='z-1 absolute min-w-26 top-8 right-10 rounded-xs text-[10px] flex flex-col items-center justify-center bg-neutral-50'>
                <div className='w-full flex flex-row justify-start py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faShareFromSquare} />
                    <p>Share</p>
                </div>
                <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faCircleDown} />
                    <p>Download</p>
                </div>
                <div onClick={() => setIsModalOpen(true)} className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <p>Rename</p>
                </div>
                <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                    <FontAwesomeIcon icon={faTrash} />
                    <p>Delete</p>
                </div>
            </div>

            {isModalOpen && (<Modal modalTitle='Rename file' modalText='Select the new name for your file. This will change the name of your file.'>
                {
                    <>
                        <div className='mb-6'>
                            <LabelInput onValueChange={setNewFileName} type='text' label='New name' name='newFileName' />
                        </div>
                        <Button buttonText='Save' onClick={() => handleRename(file)} />
                    </>
                }
            </Modal>)}
        </>
        
    )
}