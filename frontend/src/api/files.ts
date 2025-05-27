import axios from "axios";

export async function createFile(file: File, filename: string, userId: string, folderId?: string | null) {
  return await axios.post(`${import.meta.env.VITE_API_URL}/api/file/create`, {
    createdBy: userId,
    name: filename,
    size: file.size,
    type: file.type,
    folderId: folderId ?? null,
  });
}