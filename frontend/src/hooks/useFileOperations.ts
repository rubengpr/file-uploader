import { ChangeEvent } from "react";
import supabase from "@/utils/supabaseClient";
import { createFile } from "@/api/files";
import sanitize from "sanitize-filename";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

type JwtPayload = {
  id: string;
  email: string;
};

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

    const uploadFile = async (file: File, folderId: string | undefined, onUploadSuccess: () => void) => {
        if (file.size > 20 * 1024 * 1024) {
            showErrorToast("Max file size is 20MB");
            return
        }

        const token = localStorage.getItem('token');
        const user = token ? jwtDecode<JwtPayload>(token) : null;
        if (!user) {
            showErrorToast('Invalid user token');
            return;
        }

        const userId = user.id;
        const filename = sanitize(file.name);
        const folderPath = folderId ? `${userId}/${folderId}` : `${userId}`;
        
        //Upload file to Supabase
        const { error } = await supabase.storage.from('files').upload(`${folderPath}/${filename}`, file)
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
        
        const { data, error } = await supabase.storage.from('files').createSignedUrl(`${filePath}`, 86400)
        
        if (error) {
            return null
        }
        
        if (data) {
            return data.signedUrl
        }
    }

    return { handleFileChange, uploadFile, shareFile };
}