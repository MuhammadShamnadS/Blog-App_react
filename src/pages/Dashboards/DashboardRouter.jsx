import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboard from "./Admin/AdminDashboard";
import GuestDashboard from "./Guest/GuestDashboard";
import { NotificationProvider } from "../../NotificationsProvider";
import EditorDashboard from "./Editors/EditorDasboard";




const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "guest") return (<NotificationProvider>
    <GuestDashboard />
  </NotificationProvider>
  );
  if (user?.role === "author") return <aAuthorDashboard />;
  if (user?.role === "editor") return <EditorDashboard />;
};

export default DashboardRouter;

