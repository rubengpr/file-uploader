import useAvatar from "@/stores/useAvatar";
import useUser from "@/stores/useUser";
import supabase from "./supabaseClient";
import { showErrorToast } from "./toast";

const fetchSignedUrl = async () => {
    const { userId } = useUser.getState()
    const { setAvatar } = useAvatar.getState()
    
    const avatarPath = `${userId}/avatar`
    
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from('files').createSignedUrl(avatarPath, 86400)

    if (signedUrlError) {
      showErrorToast("An error occurred uploading the file")
      return;
    }

    setAvatar(signedUrlData.signedUrl)
};

export default fetchSignedUrl