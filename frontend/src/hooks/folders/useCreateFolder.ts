import sanitize from "sanitize-filename";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import axios from "axios";
import { useState } from "react";
import createNewFolder from "@/api/folders"
import useUser from "@/stores/useUser";

interface UseCreateFolderProps {
    onUploadSuccess: () => void;
    currentFolderId?: string;
}

export default function useCreateFolder({ onUploadSuccess, currentFolderId }: UseCreateFolderProps) {
    const { userId } = useUser()
    
    const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    
    const createFolder = async () => {
        const folderName = sanitize(newFolderName)
        
        try {
            const response = await createNewFolder(userId, folderName, currentFolderId);
            showSuccessToast(response.data.message);
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Something went wrong. Please, try again.";
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