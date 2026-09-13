import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import LogoutPage from "../pages/LogoutPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import DeleteAccountPage from "../pages/DeleteAccountPage";
import ProfilePage from "../pages/ProfilePage";
import PlaceholderPage from "../pages/PlaceholderPage";
import AppLayout from "../components/AppLayout";

const appRoutes = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/logout",
    element: <LogoutPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />,
  },
  {
    path: "/delete-account",
    element: <DeleteAccountPage />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/home",
        element: <PlaceholderPage />,
      },
      {
        path: "/ingredients",
        element: <PlaceholderPage />,
      },
      {
        path: "/favorites",
        element: <PlaceholderPage />,
      },
      {
        path: "/shopping-list",
        element: <PlaceholderPage />,
      },
      {
        path: "/recipes/create",
        element: <PlaceholderPage />,
      },
      {
        path: "/recipes/mine",
        element: <PlaceholderPage />,
      },
    ],
  },
]);

export default appRoutes;
