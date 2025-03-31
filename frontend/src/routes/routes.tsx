import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import LoginPage from "../pages/LoginPage"
import SignupPage from "../pages/SignupPage"
import Dashboard from "../pages/DashboardPage";
import RecoverPasswordPage from "../pages/RecoverPasswordPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
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
      path: "dashboard",
      element: <Dashboard />,
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