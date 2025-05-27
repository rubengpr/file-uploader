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

interface UploadFileProps {
    folderId: string | undefined;
    onUploadSuccess: () => void;
}

export default function useUploadFile({ folderId, onUploadSuccess }: UploadFileProps) {
    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        //Recover uploaded file
        const file = event.target.files?.[0];
        if (!file) return

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
            showErrorToast("An error occured uploading the file");
            return;
        }

        //If upload is successful, create database entry
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

        event.target.value = '';
        onUploadSuccess();
    }

    return { handleFileChange };
}