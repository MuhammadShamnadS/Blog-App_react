import { BrowserRouter, useRoutes } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import routes from "./routes/routes";


function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
