import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { faEllipsisVertical, faCircleDown, faShareFromSquare, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import OptionsMenu from './OptionsMenu';
import { showSuccessToast, showErrorToast } from '../utils/toast'
import { downloadBlob } from '../utils/downloadBlob'
import supabase from '../utils/supabaseClient';
import Modal from './Modal';
import Button from './Button';
import LabelInput from './LabelInput';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import sanitize from 'sanitize-filename';

export interface AppFile {
    id: string;
    name: string;
    createdAt: string;
    size: string;
    createdBy: string;
    user: {
        email: string;
    };
}

export interface AppFolder {
    id: string;
    name: string;
    createdAt: string;
    createdBy: string;
    user: {
        email: string;
    };
}

interface TableProps {
    files: AppFile[];
    folders: AppFolder[];
    onUpdate: (folderId: string) => void;
    onFolderClick: (folderId: string) => void;
  }

export default function Table({ files, folders, onUpdate, onFolderClick }: TableProps ) {
    
    const { folderId } = useParams<{ folderId?: string }>();
    
    const [openOptionsMenu, setOpenOptionsMenu] = useState<{ id: string; type: 'file' | 'folder' } | null>(null);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [selectedItem, setSelectedItem] = useState<{ type: 'file' | 'folder'; data: AppFile | AppFolder } | null>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);


    const handleShare = async (file: AppFile) => {

        const userId = file.createdBy;
        const fileName = file.name;
        const filePath = `${userId}/${fileName}`
        
        const { data, error } = await supabase.storage.from('files').createSignedUrl(`${filePath}`, 86400)

        if (data) {
            setSignedUrl(data.signedUrl);
            setIsShareModalOpen(true);
        }

        if (error) {
            showErrorToast("Something went wrong")
        }
    }
    
    const handleRename = async (file: AppFile) => {
        //Get old file name, from the file.name id
        const oldFileName = file.name
        const userId = file.createdBy
        const fileId = file.id;

        const itemName = sanitize(newItemName);

        const newFilePath = `${userId}/${itemName}`;
        
        const { error } = await supabase.storage.from('files').copy(`${userId}/${oldFileName}`, `${newFilePath}`);

        //Delete file with old name on Supabase storage
        if (!error) {
            await supabase.storage.from('files').remove([`${userId}/${oldFileName}`]);

            //Update file name on database
            try {
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/file/rename`, { fileId, itemName });
                showSuccessToast(response.data.message);
                onUpdate(folderId ?? "root");
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                    showErrorToast(message);
                } else {
                    showErrorToast("Unexpected error occurred.");
                }
            }
    }
    setIsRenameModalOpen(false);

};

const handleDelete = async (file: AppFile) => {
    const fileId = file.id
    const fileName = file.name
    const userId = file.createdBy

    //Delete file on Supabase Storage
    const { error } = await supabase.storage.from('files').remove([`${userId}/${fileName}`]);

    //Delete file from database
    if (!error) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/file/delete`, { data: { fileId, userId } });
            showSuccessToast(response.data.message);
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                showErrorToast(message);
            } else {
                showErrorToast("Unexpected error occurred.");
            }
        }
        setIsConfirmModalOpen(false);
        onUpdate(folderId ?? "root");
    }

}

const handleDownload = async (file: AppFile) => {
    const userId = file?.createdBy
    const fileName = file?.name

    if (!userId || !fileName) {
        showErrorToast("Missing file info");
        return;
      }

    const { data, error } = await supabase.storage.from('files').download(`${userId}/${fileName}`);

    if (error) {
        showErrorToast(error.message);
    }

    if (data) {
        downloadBlob(data, `${fileName}`);
        showSuccessToast("File downloaded successfully");
    } else {
        showErrorToast("Failed to download the file.");
    }
}

const handleRenameFolder = async (folder: AppFolder) => {
    const oldFolderName = folder.name;
    const userId = folder.createdBy;
    const folderId = folder.id;

    const itemName = sanitize(newItemName);

    //Files is an array of objects, containing files paths
    const { data, error } = await supabase.storage.from('files').list(oldFolderName);
    if (data) {
        for (const file of data) {
            await supabase.storage.from('files').copy(`${userId}/${oldFolderName}/${file.name}`, `${userId}/${itemName}/${file.name}`);
        }
    }

    if (!error) {
        await supabase.storage.from('files').remove([`${userId}/${oldFolderName}`]);

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/folder/rename`, { folderId, itemName });
            showSuccessToast(response.data.message);
            onUpdate(folderId ?? "root");
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                showErrorToast(message);
            } else {
                showErrorToast("Unexpected error occurred.");
            }
        }
    }

    setIsRenameModalOpen(false);
    
}

const handleDeleteFolder = async (folder: AppFolder) => {
    //1. Get userId and folderId
    const userId = folder.createdBy
    const folderId = folder.id

    //2. Supabase: call list into the folderId
    const { data, error } = await supabase.storage.from('files').list(`${userId}/${folderId}`)
    
    //3. Supabase: call delete into the files list
    if (data) {
        for (const folder of data) {
            await supabase.storage.from('files').remove([`${userId}/${folderId}/${folder.name}`]);
        }
    }

    if (!error) {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/folder/delete`, { data: { folderId } });
            showSuccessToast(response.data.message);
            onUpdate(folderId ?? "root");
        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                showErrorToast(message);
            } else {
                showErrorToast("Unexpected error occurred.");
            }
        }
    }
    
    setIsConfirmModalOpen(false);
}
    
const toggleMenu = (id: string, type: 'file' | 'folder') => {
    setOpenOptionsMenu((prev) =>
      prev?.id === id && prev?.type === type ? null : { id, type }
    );
  };

const handleCopyURL = async () => {
    if (signedUrl) {
        try {
          await navigator.clipboard.writeText(signedUrl);
          showSuccessToast('URL copied to clipboard');
        } catch {
          showErrorToast('Failed to copy URL');
        }
      }
    }

    return(
        <div className="w-full h-fit rounded-md shadow-md border border-gray-500">
            <table className="w-full text-white rounded-md bg-neutral-900">
                <thead className="text-xs border-b border-white">
                    <tr className='bg-neutral-700'>
                        <th className="px-6 py-2 text-left">File name</th>
                        <th className="px-6 py-2 text-left">Created at</th>
                        <th className="px-6 py-2 text-left">Size</th>
                        <th className="px-6 py-2 text-left">Created by</th>
                        <th className="px-6 py-2 text-left"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                {folders.map((folder) => (
                    <tr onClick={() => onFolderClick(folder.id)} key={folder.id} className="hover:bg-neutral-800 cursor-pointer text-gray-300 hover:text-white">
                        <td className="px-6 py-2 text-xs">{folder.name}</td>
                        <td className="px-6 py-2 text-xs">{new Date(folder.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-2 text-xs"></td>
                        <td className="px-6 py-2 text-xs">{folder.user.email}</td>
                        <td className="relative flex flex-row justify-center items-center px-6 py-2 text-xs">
                            <FontAwesomeIcon onClick={(e) => {e.stopPropagation(); toggleMenu(folder.id, 'folder')}} className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                            {openOptionsMenu?.id === folder.id && openOptionsMenu?.type === 'folder' && (<OptionsMenu
                            options={[
                                {
                                    label: "Share",
                                    icon: faShareFromSquare,
                                    onClick: () => {
                                        setOpenOptionsMenu(null);
                                    },
                                },
                                {
                                    label: "Rename",
                                    icon: faPenToSquare,
                                    onClick: () => {
                                        setSelectedItem({ type: 'folder', data: folder });
                                        setOpenOptionsMenu(null);
                                        setIsRenameModalOpen(true);
                                    }
                                },
                                {
                                    label: "Delete",
                                    icon: faTrash,
                                    onClick: () => {
                                      setSelectedItem({ type: 'folder', data: folder });
                                      setOpenOptionsMenu(null);
                                      setIsConfirmModalOpen(true);
                                    },
                                  },
                            ]} />)}
                        </td>
                    </tr>
                ))}
                {files.map((file) => (
                    <tr key={file.id} className="hover:bg-neutral-800 cursor-pointer text-gray-300 hover:text-white">
                        <td className="px-6 py-2 text-xs">{file.name}</td>
                        <td className="px-6 py-2 text-xs">{new Date(file.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-2 text-xs">  {(Number(file.size) / 1024).toFixed(1)} KB</td>
                        <td className="px-6 py-2 text-xs">{file.user.email}</td>
                        <td className="relative flex flex-row justify-center items-center px-6 py-2 text-xs">
                            <FontAwesomeIcon onClick={() => toggleMenu(file.id, 'file')} className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                            {openOptionsMenu?.id === file.id && openOptionsMenu?.type === 'file' && (<OptionsMenu
                            options={[
                                {
                                    label: "Share",
                                    icon: faShareFromSquare,
                                    onClick: () => {
                                        setOpenOptionsMenu(null);
                                        handleShare(file);
                                        setIsShareModalOpen(true);
                                    },
                                },
                                {
                                    label: "Download",
                                    icon: faCircleDown,
                                    onClick: () => {
                                        setOpenOptionsMenu(null);
                                        handleDownload(file);
                                    },
                                },
                                {
                                    label: "Rename",
                                    icon: faPenToSquare,
                                    onClick: () => {
                                        setSelectedItem({ type: 'file', data: file });
                                        setOpenOptionsMenu(null);
                                        setIsRenameModalOpen(true);
                                      },
                                },
                                {
                                    label: "Delete",
                                    icon: faTrash,
                                    onClick: () => {
                                        setSelectedItem({ type: 'file', data: file });
                                        setOpenOptionsMenu(null);
                                        setIsConfirmModalOpen(true);
                                      },
                                }
                            ]}
                            />
                        )}
                        </td>
                    </tr>
                ))}
                {isRenameModalOpen && selectedItem && (
                    <Modal modalTitle={`Rename ${selectedItem.type}`} modalText={`Select the new name for your ${selectedItem.type}. This will change its name.`}>
                        <>
                            <div className="mb-6">
                                <LabelInput onValueChange={setNewItemName} type="text" label="New name" name="newName" />
                            </div>
                        <div className="flex flex-row gap-4">
                            <Button buttonText='Cancel' onClick={() => {
                                setIsRenameModalOpen(false)
                                setNewItemName("");
                                }}/>
                            <Button buttonText="Save" onClick={() => {
                                if (selectedItem.type === 'file') {
                                    handleRename(selectedItem.data as AppFile);
                                } else {
                                    handleRenameFolder(selectedItem.data as AppFolder);
                                }
                                }}
                            />
                        </div>
                        </>
                    </Modal>
                    )}

                {isConfirmModalOpen && selectedItem && (
                    <Modal
                        modalTitle={`Delete ${selectedItem.type}`}
                        modalText={`Are you sure you want to delete this ${selectedItem.type}? You will not be able to recover it.`}
                    >
                        <div className="flex flex-row gap-4">
                        <Button buttonText="Cancel" onClick={() => setIsConfirmModalOpen(false)} />
                        <Button
                            buttonText="Delete"
                            onClick={() => {
                            if (selectedItem.type === 'file') {
                                handleDelete(selectedItem.data as AppFile);
                            } else {
                                handleDeleteFolder(selectedItem.data as AppFolder);
                            }
                            }}
                        />
                        </div>
                    </Modal>
                )}

                {isShareModalOpen && (
                    <Modal
                        modalTitle='Share file'
                        modalText='Copy and paste the following URL to give anyone access to your file'
                    >
                        <div className='flex flex-col items-center gap-4'>
                        <p className='text-center text-sm font-bold px-4'>
                            {signedUrl?.slice(0, 40)}...{signedUrl?.slice(-10)}
                        </p>

                            <Button
                                buttonText='Copy URL'
                                onClick={handleCopyURL}
                                />
                        </div>   
                    
                    </Modal>
                )}

                </tbody>
            </table>
        </div>
    )
};