import sanitize from "sanitize-filename";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import axios from "axios";
import { useState } from "react";
import { jwtDecode } from 'jwt-decode';
import createNewFolder from "@/api/folders";

type JwtPayload = {
  id: string;
  email: string;
};

export default function useCreateFolder({ onUploadSuccess }) {
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    
    const createFolder = async () => {
        
        const token = localStorage.getItem('token')
        const user = token ? jwtDecode<JwtPayload>(token) : null;
        if (!user) {
            showErrorToast('Invalid user token')
            return;
        }

        const userId = user.id
        
        const folderName = sanitize(newFolderName)
        
        try {
            const response = await createNewFolder(userId, folderName);
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

    return { createFolder, newFolderName, setNewFolderName, isNewFolderModalOpen, setIsNewFolderModalOpen }
}