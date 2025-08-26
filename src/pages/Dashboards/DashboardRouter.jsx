import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./Admin/AdminDashboard";



const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") return <AdminDashboard />;
  return <div>Unauthorized or unknown role</div>;
};

export default DashboardRouter;

