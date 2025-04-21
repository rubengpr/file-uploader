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
        
        //2. Upload file to Supabase
        const { error } = await supabase.storage.from('files').upload(`${userId}/${file.name}`, file)
        if (error) {
            showErrorToast("An error occured");
            return;
        }

        //3. If upload is successful, create database entry
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/file/create`, { createdBy: user.id, name: file.name, size: file.size, folderId: folderId ?? null })
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
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/folder/create`, { createdBy: user.id, name: newFolderName });
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
            {isNewFolderModalOpen && (<Modal modalTitle='Create folder' modalText='Select the new name for your folder. You can rename the folder name later.'>
                {
                    <>
                        <div className='mb-6'>
                            <LabelInput onValueChange={setNewFolderName} type='text' label='New folder name' name='newFolderName' />
                        </div>
                        <Button buttonText='Create folder' onClick={createFolder} />
                    </>
                }
            </Modal>)}
        </div>
    )
}