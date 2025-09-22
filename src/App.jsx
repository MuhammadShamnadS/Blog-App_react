import { BrowserRouter, useRoutes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import routes from "./routes/routes";

function AppRoutes() {
  return useRoutes(routes);
}
const basename = import.meta.env.VITE_BASENAME || '';
function App() {
  return (
     <BrowserRouter basename={basename} >
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
