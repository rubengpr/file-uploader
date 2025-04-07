import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth.ts';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Table from '../components/Table.tsx';
import Sidebar from '../components/Sidebar.tsx';
import { showErrorToast } from '../utils/toast.ts';
import axios from 'axios';

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([]);

        interface File {
                id: number;
                name: string;
                createdAt: string;
                size: string;
                createdBy: string;
                user: {
                  email: string;
                };
            }

        const navigate = useNavigate();
        
        useEffect(() => {
            if (isAuthenticated()) {
              navigate('/dashboard');
            } else {
              navigate('/login');
            }
          }, [navigate]);

          const getFiles = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/file/get`);
                setFiles(response.data);
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                    showErrorToast(message);
                } else {
                    showErrorToast("Unexpected error occurred.");
                }
            }
        }
    
        useEffect(() => {
            getFiles();
          }, []);

          const handleLogout = () => {
            navigate('/login');

            localStorage.removeItem("token")
          }

    return (
        <div className='main-page flex flex-col bg-black'>
          <div className='top-bar h-12 flex flex-row justify-between items-center px-4 border-b border-gray-700'>
            <img className='logo w-20' src="/folded-logo.svg" alt="Folded logo" />
            <FontAwesomeIcon className='text-white cursor-pointer' icon={faRightFromBracket} onClick={handleLogout} />
          </div>
          <div className='main-page flex flex-row bg-black'>
            <Sidebar onUploadSuccess={getFiles} />
            <div className="page-content w-full flex justify-center h-screen px-10 py-8">
              <Table files={files} onUpdate={getFiles} />
            </div>
          </div>
        </div>
    );
};