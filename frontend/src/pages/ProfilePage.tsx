import { useEffect, useRef, useState, FormEvent, ChangeEvent } from "react";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import supabase from '@/utils/supabaseClient';
import { jwtDecode } from "jwt-decode";
import { Toaster } from 'react-hot-toast';
import Button from "@/components/Button";
import Selector from "@/components/Selector";
import LabelInput from "@/components/LabelInput"
import MainLayout from "./MainLayout"
import { countryOptions } from "@/constants/countries";
import { languageOptions } from "@/constants/languages";
import { timezoneOptions } from "@/constants/timezones";
import useUser from "@/stores/useUser";
import useAvatar from "@/stores/useAvatar"
import axios from "axios";
import fetchSignedUrl from "@/utils/supabaseFetch";

type JwtPayload = {
    id: string,
    email: string,
}

export default function ProfilePage() {
    const { avatar, setAvatar } = useAvatar();
    const { fullname, email, country, role, language, timezone, setFullname, setCountry, setLanguage, setTimezone } = useUser();

    const [draftFullname, setDraftFullname] = useState('');
    const [draftCountry, setDraftCountry] = useState('');
    const [draftLanguage, setDraftLanguage] = useState('');
    const [draftTimezone, setDraftTimezone] = useState('');
    const [fullnameError, setFullnameError] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = localStorage.getItem('token')
    const user = jwtDecode<JwtPayload>(token || '')
    const userId = user.id
    const avatarPath = `${userId}/avatar`

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/get/${userId}`)
            const user = response.data.user
            useUser.getState().setUser(user)
    
          } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Error getting the files.";
                showErrorToast(message);
            } else {
                showErrorToast("Unexpected error occurred.");
            }
          }
        }
        fetchUserData()
      }, [])
    
    useEffect(() => {
        setDraftFullname(fullname)
        setDraftCountry(country)
        setDraftLanguage(language)
        setDraftTimezone(timezone)
    }, [fullname, country, language, timezone]);
    
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        avatarInputRef.current?.click()
    }

    useEffect(() => {
        fetchSignedUrl();
      }, [avatar]);
      

    const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
        //Check if a file has been uploaded
        const file = event.target.files?.[0];
        if (!file) return
        
        //File size validation
        if (file.size > 20 * 1024 * 1024) {
            showErrorToast("Max file size is 20MB");
            return
        }

        const defaultAvatar = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1746998854~exp=1747002454~hmac=bff075006ec87a7387029eaa590f690c79816854fb86feb9eafe3c354b0480a1&w=740"

        //Upload avatar to Supabase Storage
        //If there was no avatar yet, just upload the avatar
        if (avatar === defaultAvatar) {

            const { data: uploadData, error: uploadError } = await supabase.storage.from('files').upload(avatarPath, file)
            
            if (uploadError || !uploadData?.path) {
                showErrorToast("Failed to upload avatar")
                return;
            }
            
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from('files').createSignedUrl(uploadData.path, 86400)
            
            if (signedUrlError || !signedUrlData?.signedUrl) {
                showErrorToast("Failed to upload avatar")
                return;
            }

            setAvatar(signedUrlData.signedUrl);
            showSuccessToast("Avatar updated successfully")

        } else {
            //Remove previous avatar file
            const { error: deleteError } = await supabase.storage.from('files').remove([avatarPath])

            if (deleteError) {
                showErrorToast("Failed to upload avatar")
            }
            
            //Upload new avatar
            const { data: uploadData, error: uploadError } = await supabase.storage.from('files').upload(avatarPath, file)

            if (uploadError) {
                showErrorToast("Failed to upload avatar")
                return
            }
            
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from('files').createSignedUrl(uploadData.path, 86400)

            if (signedUrlError) {
                showErrorToast("An error occurred uploading the file")
                return
            }

            setAvatar(signedUrlData.signedUrl)
            showSuccessToast("Avatar updated successfully")
        }
    }

    const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        setFullnameError("")
        e.preventDefault();
        setIsLoading(true)

        const isFullnameValid = /^[a-zA-Z ]{3,15}$/.test(draftFullname);

        if (!isFullnameValid) {
            setFullnameError("Incorrect name format")
            return
        }

        try {
            const response = await axios.patch(`${import.meta.env.VITE_API_URL}/api/profile/update`, { userId, draftFullname, draftCountry, draftLanguage, draftTimezone })

            setFullname(draftFullname)
            setCountry(draftCountry)
            setLanguage(draftLanguage)
            setTimezone(draftTimezone)

            showSuccessToast(response.data.message)

        } catch(error) {
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.error || "Something went wrong. Please, try again.";
                setErrorMsg(message);
            } else {
                setErrorMsg("Unexpected error occurred.");
            }
            showErrorToast(errorMsg);
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <MainLayout>
            <div className="flex flex-row">
                <div className="page-content w-1/4 flex flex-col h-screen px-10 py-8 text-white">
                    <div>
                        <h1 className="text-6xl mb-10">Profile</h1>
                    </div>
                    <div className="mb-6 relative group w-50 h-50 rounded-full overflow-hidden cursor-pointer" onClick={handleAvatarClick}>
                        <img className='w-50 h-50 rounded-full scale-100 cursor-pointer' src={avatar} alt="User avatar image" />
                        <div className="absolute inset-0 bg-neutral-600 bg-opacity-40 opacity-0 group-hover:opacity-40 transition-opacity duration-200 z-10 rounded-full" />
                        <input type="file" accept=".png, .jpg, .jpeg" onChange={handleAvatarChange} ref={avatarInputRef} className='hidden' />
                        <Toaster />
                    </div>
                    <div>
                        <h1 className="text-4xl">{fullname}</h1>
                        <h3 className="text-2xl text-neutral-400">{role}</h3>
                    </div>
                </div>
                <div className="w-full h-screen flex flex-col gap-10">
                    <form onSubmit={handleProfileSubmit} method="" className="grid grid-cols-2 grid-rows-4 gap-10 mt-30 mx-20">
                        <LabelInput inputSize="md" label="Full name" type="text" placeholder="John Doe" value={draftFullname} error={fullnameError} onChange={(e) => setDraftFullname(e.target.value)}  />
                        <LabelInput disabled inputSize="md" label="Email" type="text" value={email} />
                        <Selector label="Country" options={countryOptions} value={draftCountry} onChange={setDraftCountry} />
                        <LabelInput disabled inputSize="md" label="Role" type="text" value={role} />
                        <Selector label="Language" options={languageOptions} value={draftLanguage} onChange={setDraftLanguage} />
                        <Selector label="Timezone" options={timezoneOptions} value={draftTimezone} onChange={setDraftTimezone} />
                        <div></div>
                        <div className="grid grid-cols-3">
                            <div></div>
                            <div></div>
                            <Button
                                type='submit'
                                buttonText="Save"
                                loading={isLoading} />
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}