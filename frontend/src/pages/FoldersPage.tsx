import { useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated, isTokenExpired } from '../utils/auth.ts';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket, faFilter } from '@fortawesome/free-solid-svg-icons'
import Table from '../components/Table.tsx';
import Sidebar from '../components/Sidebar.tsx';
import Input from '../components/Input.tsx';
import { showErrorToast } from '../utils/toast.ts';
import axios from 'axios';
import ButtonTable from '../components/ButtonTable.tsx';

export default function FoldersPage() {

  const { folderId } = useParams<{ folderId?: string }>();
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<keyof File | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [allFiles, setAllFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searcherValue, setSearcherValue] = useState<string>("");

  interface File {
    id: string;
    name: string;
    createdAt: string;
    type: string;
    size: number;
    createdBy: string;
    user: {
      email: string;
    }
  };

          interface Folder {
            id: string;
            name: string;
            createdAt: string;
            createdBy: string;
            user: {
              email: string;
            };
          }

          const handleLogout = () => {
            navigate('/login');

            localStorage.removeItem("token")
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
                  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {}, { withCredentials: true });
                  const { token } = response.data;
                  localStorage.setItem('token', token);
                } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Error refreshing the token";
                    showErrorToast(message);
                    handleLogout();
                } else {
                    showErrorToast("Unexpected error occurred.");
                    handleLogout();
                }
              }}
            }
            
            refreshToken()
          }, [navigate, handleLogout]);
          

          const getFiles = async (folderId: string) => {
            
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/file/get/${folderId}`);
                setFiles(response.data);
                setAllFiles(response.data);
            } catch(error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error || "Error getting the files.";
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
                    const message = error.response?.data?.error || "Error getting the folders";
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
            handleSort("createdAt");
          }
    
          useEffect(() => {
            const id = folderId ?? "root";
            getFiles(id);
            getFolders(id);
          }, [folderId]);

          const handleSort = (key: keyof File) => {
            if (sortKey === key) {
              setSortDirection(sortDirection === "asc" ? "desc" : "asc");
            } else {
              setSortKey(key);
              setSortDirection("asc");
            }
          
            const sorted = [...files].sort((a, b) => {
              const aVal = a[key];
              const bVal = b[key];
          
              if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
              }
          
              if (key === "createdAt") {
                const aDate = new Date(aVal as string).getTime();
                const bDate = new Date(bVal as string).getTime();
                return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
              }
          
              return sortDirection === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
            });
          
            setFiles(sorted);
          };

          const handleSearcherChange = (value: string) => {
            setSearcherValue(value);
            const filteredArray = searchFiles(value);
            setFiles(filteredArray);
          };          

          const searchFiles = (searchText: string): File[] => {
            if (!searchText.trim()) return allFiles;
          
            return allFiles.filter((file) =>
              file.name.toLowerCase().includes(searchText.toLowerCase())
            );
          };
          
          
          

    return (
        <div className='main-page flex flex-col bg-black'>
          <div className='top-bar h-12 flex flex-row justify-between items-center px-4 border-b border-gray-700'>
            <img className='logo w-20' src="/folded-logo.svg" alt="Folded logo" />
            <FontAwesomeIcon className='text-white cursor-pointer' icon={faRightFromBracket} onClick={handleLogout} />
          </div>
          <div className='main-page flex flex-row bg-black'>
            <Sidebar onUploadSuccess={updateTable} />
            <div className="page-content w-full flex flex-col h-screen px-10 py-8">
              <div className="flex justify-end mb-4 gap-2">
                <ButtonTable text="Filters" icon={faFilter} />
                <Input
                  type="text"
                  placeholder='Search...'
                  value={searcherValue}
                  handleInputChange={handleSearcherChange} />
              </div>
              <Table
                files={files}
                folders={folders}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onHeaderClick={handleSort}
                onUpdate={updateTable}
                onFolderClick={(id) => navigate(`/folders/${id}`)} />
            </div>
          </div>
        </div>
    );
};