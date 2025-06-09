import useAvatar from "@/stores/useAvatar";
import useUser from "@/stores/useUser";
import getSupabaseClient from "./supabaseClient";

const fetchSignedUrl = async () => {
    const { userId } = useUser.getState()
    const { setAvatar } = useAvatar.getState()
    
    const avatarPath = `${userId}/avatar`
    const supabase = getSupabaseClient()
    
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage.from('files').createSignedUrl(avatarPath, 86400)

    if (signedUrlError) {
      return;
    }

    setAvatar(signedUrlData.signedUrl)
};

export default fetchSignedUrl