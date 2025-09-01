import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./Admin/AdminDashboard";
import GuestDashboard from "./Guest/GuestDashboard";
import aAuthorDashboard from "./Authors/aAuthorDashboard";



const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") return <AdminDashboard />;
  if(user?.role === "guest") return <GuestDashboard/>;
  if(user?.role === "author") return <aAuthorDashboard/>;
  return <div>Unauthorized or unknown role</div>;
};

export default DashboardRouter;

