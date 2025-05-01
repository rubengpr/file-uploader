import SidebarOption from './SidebarOption'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import supabase from '../utils/supabaseClient';
import { Toaster } from 'react-hot-toast';
import { showSuccessToast, showErrorToast } from '../utils/toast'
import axios from 'axios';
import Modal from './Modal';
import LabelInput from './LabelInput';
import Button from './Button';
import { useParams } from 'react-router-dom';
import sanitize from 'sanitize-filename'
import { isDisabled } from '../utils/disabled';

type JwtPayload = {
    id: string,
    email: string,
}

export default function Sidebar({ onUploadSuccess }: { onUploadSuccess: () => void }) {

    const { folderId } = useParams<{ folderId: string }>();
    
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = localStorage.getItem('token');
    const user = jwtDecode<JwtPayload>(token || '');
    const userId = user.id
    
    const handleNewFileClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        //Recover uploaded file
        const file = event.target.files?.[0];
        if (!file) return

        const filename = sanitize(file.name);

        if (file.size > 20 * 1024 * 1024) {
            showErrorToast("Max file size is 20MB");
            return
        }

        const folderPath = folderId ? `${userId}/${folderId}` : `${userId}`
        
        //2. Upload file to Supabase
        const { error } = await supabase.storage.from('files').upload(`${folderPath}/${filename}`, file)
        if (error) {
            showErrorToast("An error occured uploading the file");
            return;
        }

        //3. If upload is successful, create database entry
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/file/create`, { createdBy: user.id, name: filename, size: file.size, folderId: folderId ?? null })
            showSuccessToast(response.data.message);
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                showErrorToast(message);
            } else {
                showErrorToast("Unexpected error occurred.");
            }
        }

        event.target.value = '';
        onUploadSuccess();
    }

    const createFolder = async () => {
        const folderName = sanitize(newFolderName);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/folder/create`, { createdBy: user.id, name: folderName });
            showSuccessToast(response.data.message);
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                showErrorToast(message);
            } else {
                showErrorToast("Unexpected error occurred.");
            }
        }
        setIsNewFolderModalOpen(false);
        onUploadSuccess();
    }
    
    return(
        <div className='sidebar flex flex-col w-50 bg-black px-2 py-4 border-r border-gray-700 gap-1'>
            <SidebarOption onClick={handleNewFileClick} icon={faFile} text="New file" />
            <SidebarOption onClick={() => setIsNewFolderModalOpen(true)} icon={faFolder} text="New folder" />
            <input onChange={handleFileChange} ref={fileInputRef} className='hidden' type="file" />
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
                            <LabelInput onValueChange={setNewFolderName} type='text' label='New folder name' name='newFolderName' />
                        </div>
                        <div className="flex flex-row gap-4">
                            <Button
                                buttonText='Cancel'
                                onClick={() => {
                                setIsNewFolderModalOpen(false)
                                setNewFolderName("");
                                }}
                            />
                            <Button
                                disabled={isDisabled(newFolderName)}
                                buttonText='Create folder'
                                onClick={createFolder}
                            />
                        </div>
                    </>
                }
            </Modal>)}
        </div>
    )
}