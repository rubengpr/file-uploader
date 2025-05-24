import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import ProfilePage from "@/pages/ProfilePage";
import FoldersPage from "@/pages/FoldersPage";
import RecoverPasswordPage from "@/pages/RecoverPasswordPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "signup",
      element: <SignupPage />,
    },
    {
      path: "folders",
      element: <FoldersPage />,
    },
    {
      path: "profile",
      element: <ProfilePage />,
    },
    {
      path: "folders/:folderId",
      element: <FoldersPage />,
    },
    {
      path: "recover-password",
      element: <RecoverPasswordPage />,
    },
    {
      path: "change-password",
      element: <ChangePasswordPage />,
    },
  ]);

export default router;