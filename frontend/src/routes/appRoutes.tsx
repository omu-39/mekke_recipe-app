import { createBrowserRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";

const appRoutes = createBrowserRouter([
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default appRoutes;
