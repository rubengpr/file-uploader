import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth.ts';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFolder, faFile } from '@fortawesome/free-solid-svg-icons'

export default function Dashboard() {
    
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

    return (
        <div className='main-page flex flex-col bg-black font-mono'>
          <div className='top-bar h-12 flex flex-row justify-between items-center px-4 border-b border-white'>
            <img className='logo w-20' src="/folded-logo.svg" alt="Folded logo" />
            <FontAwesomeIcon className='text-white cursor-pointer' icon={faRightFromBracket} onClick={handleLogout} />
          </div>
          <div className='main-page flex flex-row bg-black'>
            <div className='sidebar flex flex-col w-40 bg-black px-2 py-4 border-r border-white gap-2'>
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
            <div className="page-content w-full flex justify-center h-screen py-8 px-4">
              <div className="overflow-x-auto w-full max-w-5xl rounded-xs shadow-md">
                <table className="min-w-full text-sm text-white border border-white rounded-xl overflow-hidden">
                  <thead className="bg-gray-700 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left border-b border-white">ID</th>
                      <th className="px-6 py-3 text-left border-b border-white">Name</th>
                      <th className="px-6 py-3 text-left border-b border-white">Email</th>
                      <th className="px-6 py-3 text-left border-b border-white">Role</th>
                      <th className="px-6 py-3 text-left border-b border-white">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-white/10">
                    <tr className="hover:bg-gray-700">
                      <td className="px-6 py-2">1</td>
                      <td className="px-6 py-2">Alice Smith</td>
                      <td className="px-6 py-2">alice@example.com</td>
                      <td className="px-6 py-2">Admin</td>
                      <td className="px-6 py-2">Active</td>
                    </tr>
                    <tr className="hover:bg-gray-700">
                      <td className="px-6 py-2">2</td>
                      <td className="px-6 py-2">Bob Johnson</td>
                      <td className="px-6 py-2">bob@example.com</td>
                      <td className="px-6 py-2">User</td>
                      <td className="px-6 py-2">Inactive</td>
                    </tr>
                    <tr className="hover:bg-gray-700">
                      <td className="px-6 py-2">3</td>
                      <td className="px-6 py-2">Charlie Brown</td>
                      <td className="px-6 py-2">charlie@example.com</td>
                      <td className="px-6 py-2">Editor</td>
                      <td className="px-6 py-2">Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    );
};