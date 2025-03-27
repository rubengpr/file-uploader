import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth.ts';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFolder, faFile, faEllipsisVertical, faShareFromSquare, faCircleDown, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

export default function Dashboard() {
  const [optionsMenu, setOptionsMenu] = useState(false);

        const navigate = useNavigate();
        
        useEffect(() => {
            if (isAuthenticated()) {
              navigate('/dashboard');
            } else {
              navigate('/login');
            }
          }, [navigate]);

          const handleLogout = () => {
            navigate('/login');

            localStorage.removeItem("token")
          }

          const toggleMenu = () => {
            setOptionsMenu(!optionsMenu);
          }

    return (
        <div className='main-page flex flex-col bg-black font-mono'>
          <div className='top-bar h-12 flex flex-row justify-between items-center px-4 border-b border-gray-700'>
            <img className='logo w-20' src="/folded-logo.svg" alt="Folded logo" />
            <FontAwesomeIcon className='text-white cursor-pointer' icon={faRightFromBracket} onClick={handleLogout} />
          </div>
          <div className='main-page flex flex-row bg-black'>
            <div className='sidebar flex flex-col w-50 bg-black px-2 py-4 border-r border-gray-700 gap-2'>
              <div className='sidebar-option flex flex-row justify-start items-center gap-2 cursor-pointer'>
                <div className='w-4'>
                  <FontAwesomeIcon className='text-white' icon={faFile} />
                </div>
                <p className='option-text text-white text-sm'>New file</p>
              </div>
              <div className='sidebar-option flex flex-row justify-start items-center gap-2 cursor-pointer'>
                <div className='w-4'>
                  <FontAwesomeIcon className='text-white' icon={faFolder} />
                </div>
                <p className='option-text text-white text-sm'>New folder</p>
              </div>
            </div>
            <div className="page-content w-full flex justify-center h-screen px-10 py-8">
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
                    <tr className="hover:bg-neutral-800 cursor-pointer text-gray-300 hover:text-white">
                      <td className="px-6 py-2 text-xs">myscanneddocument.pdf</td>
                      <td className="px-6 py-2 text-xs">Jan 28th 17:30h</td>
                      <td className="px-6 py-2 text-xs">12 MB</td>
                      <td className="px-6 py-2 text-xs">Ruben Godoy</td>
                      <td className="flex flex-row justify-center items-center px-6 py-2 text-xs">
                        <FontAwesomeIcon className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-800 cursor-pointer text-gray-200 hover:text-white">
                      <td className="px-6 py-2 text-xs">myimages.jpg</td>
                      <td className="px-6 py-2 text-xs">Jan 28th 17:30h</td>
                      <td className="px-6 py-2 text-xs">30 MB</td>
                      <td className="px-6 py-2 text-xs">Jessica Brownie</td>
                      <td className="flex flex-row justify-center items-center px-6 py-2 text-xs">
                        <FontAwesomeIcon className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} />
                      </td>
                    </tr>
                    <tr className="hover:bg-neutral-800 cursor-pointer text-gray-200 hover:text-white">
                      <td className="px-6 py-2 text-xs">worddocumentwithalongnamesoitstruncated.doc</td>
                      <td className="px-6 py-2 text-xs">Jan 28th 17:30h</td>
                      <td className="px-6 py-2 text-xs">135 KB</td>
                      <td className="px-6 py-2 text-xs">Rose Red</td>
                      <td className="relative flex flex-row justify-center items-center px-6 py-2 text-xs">
                        <FontAwesomeIcon className='px-2 py-1 rounded-full hover:bg-neutral-600' icon={faEllipsisVertical} onClick={toggleMenu} />
                        <div className={optionsMenu ? 'absolute min-w-26 top-8 right-10 rounded-xs text-[10px] flex flex-col items-center justify-center bg-neutral-50' : 'hidden'} >
                          <div className='w-full flex flex-row justify-start py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                            <FontAwesomeIcon icon={faShareFromSquare} />
                            <p>Share</p>
                          </div>
                          <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                            <FontAwesomeIcon icon={faCircleDown} />
                            <p>Download</p>
                          </div>
                          <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <p>Rename</p>
                          </div>
                          <div className='w-full flex flex-row justify-start top-5 py-1 hover:bg-neutral-300 text-neutral-800 px-3 gap-2'>
                            <FontAwesomeIcon icon={faTrash} />
                            <p>Delete</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    );
};