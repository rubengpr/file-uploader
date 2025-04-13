import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import OptionsMenu from './OptionsMenu';

export interface AppFile {
    id: number;
    name: string;
    createdAt: string;
    size: string;
    createdBy: string;
    user: {
        email: string;
    };
}

export interface AppFolder {
    id: number;
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
    onUpdate: () => void;
  }

export default function Table({ files, folders, onUpdate }: TableProps ) {
    const [openOptionsMenu, setOpenOptionsMenu] = useState< number | null>(null);

    const toggleMenu = (rowId: number) => {
        setOpenOptionsMenu((prev) => (prev === rowId ? null : rowId))
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
                    <tr key={folder.id} className="hover:bg-neutral-800 cursor-pointer text-gray-300 hover:text-white">
                        <td className="px-6 py-2 text-xs">{folder.name}</td>
                        <td className="px-6 py-2 text-xs">{new Date(folder.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-2 text-xs"></td>
                        <td className="px-6 py-2 text-xs">{folder.user.email}</td>
                    </tr>
                ))}
                {files.map((file) => (
                    <tr key={file.id} className="hover:bg-neutral-800 cursor-pointer text-gray-300 hover:text-white">
                        <td className="px-6 py-2 text-xs">{file.name}</td>
                        <td className="px-6 py-2 text-xs">{new Date(file.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-2 text-xs">  {(Number(file.size) / 1024).toFixed(1)} KB</td>
                        <td className="px-6 py-2 text-xs">{file.user.email}</td>
                        <td className="relative flex flex-row justify-center items-center px-6 py-2 text-xs">
                            <FontAwesomeIcon onClick={() => toggleMenu(file.id)} className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                            {openOptionsMenu === file.id && (<OptionsMenu file={file} onUpdate={onUpdate} />)}
                        </td>
                    </tr>
                ))}

                </tbody>
            </table>
        </div>
    )
};