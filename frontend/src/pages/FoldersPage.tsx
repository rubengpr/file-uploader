import { faFilter, faFile } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isTokenExpired } from '@/utils/auth.ts';
import { showErrorToast } from '@/utils/toast.ts';
import ButtonTable from '@/components/ButtonTable.tsx';
import Button from '@/components/Button.tsx';
import DatePicker from '@/components/DatePicker.tsx';
import Input from '@/components/Input.tsx';
import MainLayout from './MainLayout.tsx';
import Modal from '@/components/Modal.tsx';
import Selector from '@/components/Selector.tsx';
import Sidebar from '@/components/Sidebar.tsx';
import Table from '@/components/Table.tsx';
import axios from 'axios';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function FoldersPage() {
  const { folderId } = useParams<{ folderId?: string }>();
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<keyof File | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [allFiles, setAllFiles] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searcherValue, setSearcherValue] = useState<string>("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [type, setType] = useState("All types");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
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
        } else {
            showErrorToast("Unexpected error occurred.");
        }
      }}
    }
    
    refreshToken()
  }, [navigate]);

  const getFiles = async (folderId: string) => {
    
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/file/get/${folderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
        const token = localStorage.getItem("token")
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/folder/get/${folderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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

  const updateTable = async () => {
    const id = folderId ?? "root";
    await Promise.all([getFiles(id), getFolders(id)]);
  }
    
  useEffect(() => {
    const fetchData = async () => {
      const id = folderId ?? "root";
      setLoading(true);
      await Promise.all([getFiles(id), getFolders(id)]);
      setLoading(false);
    };
    
    fetchData();
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

  const handleFilter = () => {
    const filtered = filterFiles(allFiles, type, date)
    setFiles(filtered);
    setIsFilterModalOpen(false);
  }
  
  const filterFiles = (files: File[], type: string, date: string): File[] => {
    return files.filter(file =>
      (type === "All types" || file.type === type) &&
      new Date(file.createdAt) >= new Date(date)
    );
  };

  function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  const today = formatDate(new Date());

  const toggleShareModal = () => {
    return setIsShareModalOpen(!isShareModalOpen)
  }

  const toggleRenameModal = () => {
    return setIsRenameModalOpen(!isRenameModalOpen)
  }

  const toggleDeleteModal = () => {
    return setIsDeleteModalOpen(!isDeleteModalOpen)
  }

  const handleFolderClick = (folder: Folder) => {
    navigate(`/folders/${folder.id}`);
  };
        
    return (
        <MainLayout>
          <div className='main-page flex flex-row bg-black'>
            <Sidebar onUploadSuccess={updateTable} />
            <div className="page-content w-full flex flex-col h-screen px-10 py-8">
              {/* Add the Breadcrumbs component here */}
              <Breadcrumbs 
                currentFolderId={folderId} 
              />
              {loading ? (
                <div className='flex flex-col justify-center items-center w-full mt-10'>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <p className='text-white'>Loading...</p>
                </div>
              ) : files.length === 0 && folders.length === 0 ? (
                <div className='flex flex-col justify-center items-center w-full mt-10'>
                  <FontAwesomeIcon className='text-white mb-2' icon={faFile} size='4x' />
                  <p className='text-white mb-6'>Oops... This folder is empty</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-4 gap-2">
                    <ButtonTable
                      text="Filters"
                      icon={faFilter}
                      onClick={() => setIsFilterModalOpen(true)} />
                    <Input
                      type="text"
                      placeholder='Search...'
                      inputSize='sm'
                      value={searcherValue}
                      onChange={handleSearcherChange} />
                  </div>
                    <Table
                    files={files}
                    folders={folders}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onHeaderClick={handleSort}
                    onUpdate={updateTable}
                    onFolderClick={(id) => {
                      const folder = folders.find(f => f.id === id);
                      if (folder) {
                        handleFolderClick(folder);
                      }
                    }}
                    isShareModalOpen={isShareModalOpen}
                    toggleShareModal={toggleShareModal}
                    isRenameModalOpen={isRenameModalOpen}
                    toggleRenameModal={toggleRenameModal}
                    isDeleteModalOpen={isDeleteModalOpen}
                    toggleDeleteModal={toggleDeleteModal}
                    />
                  </>
                  )}
                </div>
          </div>
          {isFilterModalOpen && (
            <Modal
              modalTitle="Filters"
              onClose={() => {
                  setIsFilterModalOpen(false);
              }}
              >
                <div className='w-full pt-3 py-3'>
                  <div className='flex flex-col justify-start gap-3'>
                    <p className='font-bold text-sm text-white'>Type</p>
                    <Selector
                      options={[
                        {
                          value: "All types",
                          name: "All types",
                        },
                        {
                          value: "doc",
                          name: "doc",
                        },
                        {
                          value: "docx",
                          name: "docx",
                        },
                        {
                          value: "xls",
                          name: "xls",
                        },
                        {
                          value: "xlsx",
                          name: "xlsx",
                        },
                        {
                          value: "csv",
                          name: "csv",
                        },
                        {
                          value: "txt",
                          name: "txt",
                        },
                        {
                          value: "pdf",
                          name: "pdf",
                        },
                        {
                          value: "jpg",
                          name: "jpg",
                        },
                        {
                          value: "png",
                          name: "png",
                        },
                        {
                          value: "gif",
                          name: "gif",
                        },
                        {
                          value: "bmp",
                          name: "bmp",
                        },
                        {
                          value: "svg",
                          name: "svg",
                        },
                        {
                          value: "webp",
                          name: "webp",
                        },
                      ]}
                      value={type}
                      onChange={(newType) => setType(newType)}
                      />
                      <hr className="border-t border-white my-4" />
                      <p className='font-bold text-sm text-white'>Created after</p>
                    <DatePicker
                      date={date}
                      min='2025-01-01'
                      max={today}
                      onChange={(newDate) => setDate(newDate)}
                      />
                  </div>
                </div>
                <div className='flex flex-row gap-4 mt-3'>
                  <Button
                    type='button'
                    buttonText='Cancel'
                    onClick={() => setIsFilterModalOpen(false)} />
                  <Button
                    type='button'
                    buttonText='Apply filters'
                    onClick={handleFilter} />
                </div>
              </Modal>
          )}
        </MainLayout>
    );
};