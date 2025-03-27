import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import OptionsMenu from './OptionsMenu';

export default function Table() {
    const [openOptionsMenu, setOpenOptionsMenu] = useState< number | null>(null);

    const toggleMenu = (rowId: number) => {
        setOpenOptionsMenu((prev) => (prev === rowId ? null : rowId))
    }
    
    const data = [
        { id: 1, name: "myscanneddocument.pdf", createdAt: "Jan 28th 17:30h", size: "12 MB", createdBy: "Ruben Godoy" },
        { id: 2, name: "myimages.jpg", createdAt: "Jan 28th 17:30h", size: "18 MB", createdBy: "Jessica Brownie" },
        { id: 3, name: "worddocumentwithalongnamesoitstruncated.doc", createdAt: "Jan 28th 17:30h", size: "63 KB", createdBy: "Rose Red" },
    ]

    return(
        <div className="page-content w-full flex justify-center h-screen px-10 py-8 bg-black font-mono">
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
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-neutral-800 cursor-pointer text-gray-300 hover:text-white">
                            <td className="px-6 py-2 text-xs">{row.name}</td>
                            <td className="px-6 py-2 text-xs">{row.createdAt}</td>
                            <td className="px-6 py-2 text-xs">{row.size}</td>
                            <td className="px-6 py-2 text-xs">{row.createdBy}</td>
                            <td className="relative flex flex-row justify-center items-center px-6 py-2 text-xs">
                                <FontAwesomeIcon onClick={() => toggleMenu(row.id)} className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                                {openOptionsMenu === row.id && <OptionsMenu />}
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </div>
    )
};