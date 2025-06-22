import axios from "axios";

export default async function createNewFolder(userId: string, folderName: string) {
    const token = localStorage.getItem('token')
    return await axios.post(
        `${import.meta.env.VITE_API_URL}/api/folder/create`, {
            createdBy: userId,
            name: folderName
        },
        {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        }
    );
}