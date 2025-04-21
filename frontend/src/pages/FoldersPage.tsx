import { useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated, isTokenExpired } from '../utils/auth.ts';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Table from '../components/Table.tsx';
import Sidebar from '../components/Sidebar.tsx';
import { showErrorToast } from '../utils/toast.ts';
import axios from 'axios';

export default function FoldersPage() {

  const { folderId } = useParams<{ folderId?: string }>();
  const navigate = useNavigate();

  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

        interface File {
                id: string;
                name: string;
                createdAt: string;
                size: string;
                createdBy: string;
                user: {
                  email: string;
                };
          }

          interface Folder {
            id: string;
            name: string;
            createdAt: string;
            createdBy: string;
            user: {
              email: string;
            };
          }
        
          useEffect(() => {
            if (!isAuthenticated()) {
              navigate('/login');
            }
          }, [navigate]);

          useEffect(() => {
            const refreshToken = async () => {
              if (isTokenExpired()) {
                try {
                  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`);
                  const { token } = response.data;
                  localStorage.setItem('token', token);
                } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                    showErrorToast(message);
                } else {
                    showErrorToast("Unexpected error occurred.");
                }
              }}
            }
            
            refreshToken()
          }, [navigate]);
          

          const getFiles = async (folderId: string) => {
            
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/file/get/${folderId}`);
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

          const getFolders = async (folderId: string) => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/folder/get/${folderId}`);
                setFolders(response.data);
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                    showErrorToast(message);
                } else {
                    showErrorToast("Unexpected error occurred.");
                }
            }
          }

          const updateTable = () => {
            const id = folderId ?? "root";
            getFiles(id);
            getFolders(id);
          }
    
          useEffect(() => {
            const id = folderId ?? "root";
            getFiles(id);
            getFolders(id);
          }, [folderId]);
          

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
            <Sidebar onUploadSuccess={updateTable} />
            <div className="page-content w-full flex justify-center h-screen px-10 py-8">
              <Table files={files} folders={folders} onUpdate={updateTable} onFolderClick={(id) => navigate(`/folders/${id}`)} />
            </div>
          </div>
        </div>
    );
};