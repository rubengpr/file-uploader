import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Topbar from "../components/Topbar";
import OptionsMenu from "../components/OptionsMenu";
import { faUser, faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useAvatar from "../stores/useAvatar"

export default function MainLayout({ children }) {
  const { avatar } = useAvatar();
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => {
    setOpenUserMenu((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  
  return (
    <div className="main-page flex flex-col bg-black min-h-screen">
      <Topbar avatar={avatar} handleAvatarClick={toggleUserMenu} />
        <div>
          {children}
        </div>
      {openUserMenu && (
        <OptionsMenu
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