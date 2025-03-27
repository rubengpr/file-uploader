import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth.ts';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import Table from '../components/Table.tsx';

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
              <Table />
            </div>
          </div>
        </div>
    );
};