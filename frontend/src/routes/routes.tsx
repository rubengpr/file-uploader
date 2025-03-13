import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import LoginPage from "../pages/LoginPage"
import SignupPage from "../pages/SignupPage"
import Form from "../components/Form";

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
      path: "form",
      element: <Form title={""} buttonText={""} children={undefined} />,
    },
  ]);

export default router;