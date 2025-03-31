import SidebarOption from './SidebarOption'
import { faFolder, faFile } from '@fortawesome/free-solid-svg-icons'
import { useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import { createSupabaseClientWithAuth } from '../utils/supabaseClientWithAuth';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { showSuccessToast, showErrorToast } from '../utils/toast'

type JwtPayload = {
    id: string,
    email: string,
}

export default function Sidebar() {

    const navigate = useNavigate();
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleNewFileClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        //Recover uploaded file
        const file = event.target.files?.[0];
        if (!file) return
        
        //1. Get userId
        const token = localStorage.getItem('token');
        const stoken = localStorage.getItem('stoken');
      
        if (!token || !stoken) {
          navigate('/login');
          return;
        }

        const user = jwtDecode<JwtPayload>(token || '');
        const userId = user.id
        const supabase = createSupabaseClientWithAuth(stoken || '');
        
        //2. Upload file to Supabase
        const { data, error } = await supabase.storage.from('files').upload(`${userId}/${file.name}`, file)
        if (error) {
            showErrorToast("An error occured");
        } else {
            showSuccessToast("File successfully uploaded");
            console.log(data);
        }

        //3. If upload is successful, create database entry

        event.target.value = '';
    }
    
    return(
        <div className='sidebar flex flex-col w-50 bg-black px-2 py-4 border-r border-gray-700 gap-1'>
            <SidebarOption onClick={handleNewFileClick} icon={faFile} text="New file" />
            <SidebarOption icon={faFolder} text="New folder" />
            <input onChange={handleFileChange} ref={fileInputRef} className='hidden' type="file" />
            <Toaster />
        </div>
    )
}