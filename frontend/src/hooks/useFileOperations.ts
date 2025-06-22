import { ChangeEvent } from "react";
import supabase from "@/utils/supabaseClient";
import { createFile } from "@/api/files";
import sanitize from "sanitize-filename";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import useUser from "@/stores/useUser";

interface AppFile {
    id: string;
    name: string;
    createdAt: string;
    type: string;
    size: number;
    createdBy: string;
    user: {
        email: string;
    };
}

export default function useFileOperations() {

    const { userId } = useUser()

    const uploadFile = async (file: File, folderId: string | undefined, onUploadSuccess: () => void) => {
        if (file.size > 20 * 1024 * 1024) {
            showErrorToast("Max file size is 20MB");
            return
        }

        if (file.name.length > 60) {
            showErrorToast("File name must be under 60 characters")
            return
        }

        const filename = sanitize(file.name);
        const folderPath = folderId ? `${userId}/${folderId}` : `${userId}`;
        
        //Upload file to Supabase
        const { error } = await supabase().storage.from('files').upload(`${folderPath}/${filename}`, file)
        if (error) {
            showErrorToast("An error occurred uploading the file");
            return;
        }

        try {
            const response = await createFile(file, filename, userId, folderId);
            showSuccessToast(response.data.message);
        } catch (error) {
            if (axios.isAxiosError(error)) {
            const message = error.response?.data?.error || "Something went wrong. Please, try again.";
            showErrorToast(message);
        } else {
            showErrorToast("Unexpected error occurred.");
        }}

        onUploadSuccess();
    }

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, folderId: string | undefined, onUploadSuccess: () => void) => {
        const file = e.target.files?.[0];
        if (file) await uploadFile(file, folderId, onUploadSuccess);
        e.target.value = "";
    }

    const shareFile = async (file: AppFile) => {
        const userId = file.createdBy;
        const fileName = file.name;
        const filePath = `${userId}/${fileName}`
        
        const { data, error } = await supabase().storage.from('files').createSignedUrl(`${filePath}`, 86400)
        
        if (error) {
            return null
        }
        
        if (data) {
            return data.signedUrl
        }
    }

    const renameFile = async (file: AppFile, newItemName: string) => {

        const oldFileName = file.name
        const userId = file.createdBy
        const fileId = file.id;

        const itemName = sanitize(newItemName);

        const newFilePath = `${userId}/${itemName}`;
        
        const { error } = await supabase().storage.from('files').copy(`${userId}/${oldFileName}`, `${newFilePath}`);

        //Delete file with old name on Supabase storage
        if (!error) {
            await supabase().storage.from('files').remove([`${userId}/${oldFileName}`]);

            //Update file name on database
            try {
                const token = localStorage.getItem('token')
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/file/rename`, { fileId, itemName }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                return response.data.message
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                    showErrorToast(message);
                } else {
                    showErrorToast("Unexpected error occurred.");
                }
            }
        }
    }

    const deleteFile = async (file: AppFile) => {
        const fileId = file.id
        const fileName = file.name
        const userId = file.createdBy

        //Delete file on Supabase Storage
        const { error } = await supabase().storage.from('files').remove([`${userId}/${fileName}`]);

        //Delete file from database
        if (!error) {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/file/delete`, {
                    data: { fileId, userId },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                return response.data.message
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                    showErrorToast(message);
                    return false
                } else {
                    showErrorToast("Unexpected error occurred.");
                    return false
                }
            }
        }
    }

    return { handleFileChange, uploadFile, shareFile, renameFile, deleteFile };
}