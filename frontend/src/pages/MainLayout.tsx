import { faUser, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import Topbar from "@/components/Topbar";
import DropdownMenu from "@/components/DropdownMenu";
import { showErrorToast } from '@/utils/toast';
import { isAuthenticated } from '@/utils/auth';
import fetchSignedUrl from '@/utils/supabaseFetch';
import useUser from '@/stores/useUser';
import useAvatar from "@/stores/useAvatar"

export default function MainLayout({ children }) {
  const { avatar } = useAvatar();
  const { userId, setUser } = useUser();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          navigate('/login')
          return
        }
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUser(response.data.user)
      } catch {
        showErrorToast?.("Failed to fetch user data");
        localStorage.removeItem("token");
        localStorage.removeItem("stoken");
        navigate("/login");
      }
      }

      if (!userId && isAuthenticated()) {
        fetchUser();
      }
  }, [userId, setUser, navigate])

  const defaultAvatar= "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"

  useEffect(() => {
    if (avatar === defaultAvatar && userId) {
      fetchSignedUrl()
    }
  }, [avatar, userId]);
  
  const toggleUserMenu = () => {
    setOpenUserMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("stoken");
    navigate("/login");
  };
  
  return (
    <div className="main-page flex flex-col bg-black min-h-screen">
      <Topbar avatar={avatar} handleAvatarClick={toggleUserMenu} />
        <div>
          {children}
        </div>
      {openUserMenu && (
        <DropdownMenu
          options={[
            {
              label: "Profile",
              icon: faUser,
              onClick: () => {
                setOpenUserMenu(false);
                navigate("/profile");
              },
            },
            {
              label: "Settings",
              icon: faGear,
              onClick: () => {
                setOpenUserMenu(false);
                navigate("/settings");
              },
            },
            {
              label: "Logout",
              icon: faRightFromBracket,
              onClick: handleLogout,
            },
          ]}
        />
      )}
    </div>
  );
}