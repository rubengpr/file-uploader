import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faCircleDown, faShareFromSquare, faPenToSquare, faTrash, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { showSuccessToast, showErrorToast } from '@/utils/toast'
import { downloadBlob } from '@/utils/downloadBlob'
import supabase from '@/utils/supabaseClient';
import { useParams } from 'react-router-dom';
import { isDisabled } from '@/utils/disabled';
import { formatFileSize } from '@/utils/formatFileSize';
import Button from './Button';
import Modal from './Modal';
import LabelInput from './LabelInput';
import DropdownMenu from './DropdownMenu';
import axios from 'axios';
import sanitize from 'sanitize-filename';
import useFileOperations from '@/hooks/useFileOperations'

export interface AppFile {
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
    sortDirection: string;
    sortKey: keyof AppFile | null;
    onUpdate: (folderId: string) => void;
    onFolderClick: (folderId: string) => void;
    onHeaderClick: (key: keyof AppFile) => void;
    isShareModalOpen: boolean;
    toggleShareModal: () => void;
    isRenameModalOpen: boolean;
    toggleRenameModal: () => void;
    isDeleteModalOpen: boolean;
    toggleDeleteModal: () => void;
}

export default function Table({ files, folders, sortDirection, sortKey, onUpdate, onFolderClick, onHeaderClick, isShareModalOpen, toggleShareModal, isRenameModalOpen, toggleRenameModal, isDeleteModalOpen, toggleDeleteModal }: TableProps ) {
    
    const { folderId } = useParams<{ folderId?: string }>()

    const { shareFile, renameFile, deleteFile } = useFileOperations()
    
    const [openOptionsMenu, setOpenOptionsMenu] = useState<{ id: string; type: 'file' | 'folder' } | null>(null);
    const [newItemName, setNewItemName] = useState("");
    const [selectedItem, setSelectedItem] = useState<{ type: 'file' | 'folder'; data: AppFile | AppFolder } | null>(null);
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    
    const handleShare = async (file: AppFile) => {
        setOpenOptionsMenu(null)

        const sharedUrl = await shareFile(file)

        if (sharedUrl) {
            setSignedUrl(sharedUrl)
            toggleShareModal()
        } else {
            showErrorToast("An error happened while generating the URL")
        }
    }
    
    const handleRename = async (file: AppFile) => {

        const rename = await renameFile(file, newItemName)

        if (rename) {
            showSuccessToast("File renamed successfully")
        } else {
            showErrorToast("An error happened while renaming the file")
        }
        
        onUpdate(folderId ?? "root");
        toggleRenameModal()
    }

    const handleDelete = async (file: AppFile) => {
        const result = await deleteFile(file)

        if (result) {
            showSuccessToast("File deleted successfully")
        } else {
            showErrorToast("An error occurred deleting the file")
        }
        
        onUpdate(folderId ?? "root");
        toggleDeleteModal()
    }

    const handleDownload = async (file: AppFile) => {
        const userId = file?.createdBy
        const fileName = file?.name

        if (!userId || !fileName) {
            showErrorToast("Missing file info");
            return;
        }

        const { data, error } = await supabase().storage.from('files').download(`${userId}/${fileName}`);

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
        const { data, error } = await supabase().storage.from('files').list(oldFolderName);
        if (data) {
            for (const file of data) {
                await supabase().storage.from('files').copy(`${userId}/${oldFolderName}/${file.name}`, `${userId}/${itemName}/${file.name}`);
            }
        }

        if (!error) {
            await supabase().storage.from('files').remove([`${userId}/${oldFolderName}`]);

            try {
                const token = localStorage.getItem('token')
                const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/folder/rename`, { folderId, itemName }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
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
        onUpdate(folderId ?? "root");
        toggleRenameModal()
        
    }

    const handleDeleteFolder = async (folder: AppFolder) => {
    //1. Get userId and folderId
    const userId = folder.createdBy
    const folderId = folder.id

    //2. Supabase: call list into the folderId
    const { data, error } = await supabase().storage.from('files').list(`${userId}/${folderId}`)
    
    //3. Supabase: call delete into the files list
    if (data) {
        for (const folder of data) {
            await supabase().storage.from('files').remove([`${userId}/${folderId}/${folder.name}`]);
        }
    }

    if (!error) {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/folder/delete`, {
                data: { folderId },
                headers: { 'Authorization': `Bearer ${token}` }
            });
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
    
    toggleDeleteModal()
    }
    
    const toggleMenu = (id: string, type: 'file' | 'folder') => {
    setOpenOptionsMenu((prev) =>
      prev?.id === id && prev?.type === type ? null : { id, type }
    );
    }

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
            <table className="w-full text-white bg-neutral-900">
                <thead className="text-xs border-b border-white overflow-hidden">
                    <tr className='bg-neutral-700'>
                        <th className="pl-6 pr-1 py-2 text-left cursor-pointer" onClick={() => onHeaderClick("name")}>
                            <div className="flex flex-row items-center gap-1">
                                File name
                                {sortKey === "name" && (
                                    <FontAwesomeIcon icon={sortDirection === "asc" ? faCaretUp : faCaretDown} />
                                )}
                            </div>
                        </th>
                        <th className="pl-6 pr-1 py-2 text-left cursor-pointer" onClick={() => onHeaderClick("createdAt")}>
                            <div className="flex flex-row items-center gap-1">
                            Created at
                            {sortKey === "createdAt" && (
                                <FontAwesomeIcon icon={sortDirection === "asc" ? faCaretUp : faCaretDown} />
                            )}
                            </div>
                        </th>
                        <th className="pl-6 pr-1 py-2 text-left cursor-pointer" onClick={() => onHeaderClick("type")}>
                            <div className="flex flex-row items-center gap-1">
                            Type
                            {sortKey === "type" && (
                                <FontAwesomeIcon icon={sortDirection === "asc" ? faCaretUp : faCaretDown} />
                            )}
                            </div>
                        </th>
                        <th className="pl-6 pr-1 py-2 text-left cursor-pointer" onClick={() => onHeaderClick("size")}>
                            <div className="flex flex-row items-center gap-1">
                            Size
                            {sortKey === "size" && (
                                <FontAwesomeIcon icon={sortDirection === "asc" ? faCaretUp : faCaretDown} />
                            )}
                            </div>
                        </th>
                        <th className="pl-6 pr-1 py-2 text-left cursor-pointer" onClick={() => onHeaderClick("createdBy")}>
                            <div className="flex flex-row items-center gap-1">
                            Created by
                            {sortKey === "createdBy" && (
                                <FontAwesomeIcon icon={sortDirection === "asc" ? faCaretUp : faCaretDown} />
                            )}
                            </div>
                        </th>
                        <th className="px-6 py-2 text-left"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                {folders.map((folder) => (
                    <tr onClick={() => onFolderClick(folder.id)} key={folder.id} className="hover:bg-neutral-800 cursor-pointer text-gray-300 hover:text-white">
                        <td className="px-6 py-2 text-xs">{folder.name}</td>
                        <td className="px-6 py-2 text-xs">{new Date(folder.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-2 text-xs"></td>
                        <td className="px-6 py-2 text-xs"></td>
                        <td className="px-6 py-2 text-xs">{folder.user.email}</td>
                        <td className="relative flex flex-row justify-center items-center px-6 py-2 text-xs">
                            <FontAwesomeIcon onClick={(e) => {e.stopPropagation(); toggleMenu(folder.id, 'folder')}} className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                            {openOptionsMenu?.id === folder.id && openOptionsMenu?.type === 'folder' && (<DropdownMenu
                            options={[
                                {
                                    label: "Rename",
                                    icon: faPenToSquare,
                                    onClick: () => {
                                        setSelectedItem({ type: 'folder', data: folder });
                                        setOpenOptionsMenu(null);
                                        toggleRenameModal()
                                    }
                                },
                                {
                                    label: "Delete",
                                    icon: faTrash,
                                    onClick: () => {
                                      setSelectedItem({ type: 'folder', data: folder });
                                      setOpenOptionsMenu(null);
                                      toggleDeleteModal()
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
                        <td className="px-6 py-2 text-xs">{file.type}</td>
                        <td className="px-6 py-2 text-xs">{formatFileSize(file.size)}</td>
                        <td className="px-6 py-2 text-xs">{file.user.email}</td>
                        <td className="relative flex flex-row justify-center items-center px-6 py-2 text-xs">
                            <FontAwesomeIcon onClick={() => toggleMenu(file.id, 'file')} className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                            {openOptionsMenu?.id === file.id && openOptionsMenu?.type === 'file' && (<DropdownMenu
                            options={[
                                {
                                    label: "Share",
                                    icon: faShareFromSquare,
                                    onClick: () => {handleShare(file)}
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
                                        setOpenOptionsMenu(null)
                                        toggleRenameModal()
                                    },
                                },
                                {
                                    label: "Delete",
                                    icon: faTrash,
                                    onClick: () => {
                                        setSelectedItem({ type: 'file', data: file });
                                        setOpenOptionsMenu(null);
                                        toggleDeleteModal()
                                      },
                                }
                            ]}
                            />
                        )}
                        </td>
                    </tr>
                ))}
                {isRenameModalOpen && selectedItem && (
                    <Modal
                    modalTitle={`Rename ${selectedItem.type}`}
                    modalText={`Select the new name for your ${selectedItem.type}. This will change its name.`}
                    onClose={() => {
                        toggleRenameModal()
                        setNewItemName('');
                    }}
                    >
                        <>
                            <div className="mb-6">
                                <LabelInput inputSize='sm' onValueChange={setNewItemName} type="text" label="New name" name="newName" />
                            </div>
                        <div className="flex flex-row gap-4">
                            <Button
                                type='button'
                                buttonText='Cancel'
                                onClick={() => {
                                setOpenOptionsMenu(null)
                                toggleRenameModal()
                                setNewItemName("");
                                }}/>
                            <Button
                                type='button'
                                disabled={isDisabled(newItemName)}
                                buttonText="Save"
                                onClick={() => {
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

                {isDeleteModalOpen && selectedItem && (
                    <Modal
                        modalTitle={`Delete ${selectedItem.type}`}
                        modalText={`Are you sure you want to delete this ${selectedItem.type}? You will not be able to recover it.`}
                        onClose={toggleDeleteModal}
                    >
                        <div className="flex flex-row gap-4">
                        <Button
                            type='button'
                            buttonText="Cancel"
                            onClick={toggleDeleteModal} />
                        <Button
                            type='button'
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
                        modalText='Share the URL with anyone & give them access to your file'
                        onClose={() => {
                            toggleShareModal();
                            setNewItemName('');
                        }}
                    >
                        <div className='flex flex-col items-center gap-4'>
                            <Button
                                type='button'
                                buttonText='Copy URL to clipboard'
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