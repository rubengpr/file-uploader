import useAvatar from "@/stores/useAvatar";
import supabase from "./supabaseClient";
import { showErrorToast } from "./toast";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
    id: string;
    email: string;
}

const fetchSignedUrl = async () => {
    const { setAvatar } = useAvatar.getState(); // Use getState() instead of hook
    
    const token = localStorage.getItem('token')
    if (!token) return
    
    const user = jwtDecode<JwtPayload>(token)
    const avatarPath = `${user.id}/avatar`
    
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from('files').createSignedUrl(avatarPath, 86400)

    if (signedUrlError) {
      showErrorToast("An error occurred uploading the file")
      return;
    }

    setAvatar(signedUrlData.signedUrl)
};

export default fetchSignedUrl