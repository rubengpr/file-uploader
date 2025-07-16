import axios from "axios";

export async function getFolderHierarchy(folderId: string) {
    const token = localStorage.getItem('token')
    return await axios.get(
        `${import.meta.env.VITE_API_URL}/api/folder/hierarchy/${folderId}`,
        {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        }
    );
}

export default async function createNewFolder(userId: string, folderName: string, parentId?: string) {
    const token = localStorage.getItem('token')
    return await axios.post(
        `${import.meta.env.VITE_API_URL}/api/folder/create`, {
            createdBy: userId,
            name: folderName,
            parentId: parentId || null // Send null if no parentId is provided
        },
        {
            headers: { 
                'Authorization': `Bearer ${token}`
            }
        }
    );
}