import { faUser, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Topbar from "@/components/Topbar";
import DropdownMenu from "@/components/DropdownMenu";
import useAvatar from "@/stores/useAvatar"

export default function MainLayout({ children }) {
  const { avatar } = useAvatar();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const navigate = useNavigate();

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