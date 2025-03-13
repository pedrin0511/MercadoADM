import { createBrowserRouter, Navigate } from "react-router-dom";
import HomeLayout from "./pages/home/HomeLayout";
import Home from "./pages/home/Home";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/login";
import { jwtDecode } from 'jwt-decode';
import CreateCompany from "./pages/create/CreateCompany/CreateCompany";
import CreateUser from "./pages/create/CreateUser/CreateUser";
import AllUsers from "./pages/users/Allusers";
import AllCompany from "./pages/company/AllCompany";

// Tipo personalizado para o payload do JWT
interface JwtPayload {
  role: string;
  [key: string]: any;  // Permite outras propriedades no payload do JWT
}

// Função para verificar se o usuário é admin
const checkAdminRole = () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        console.log('Token não encontrado');
        return false;
    }

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.role === 'admin';
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return false;
    }
};

// Protegendo a rota /active com base no papel do usuário
interface ProtectedRouteProps {
  element: React.ReactNode;  // Atualizado para React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    return checkAdminRole() ? <>{element}</> : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
    {
        path: "/active",
        element: <ProtectedRoute element={<HomeLayout />} />,
        children: [
            {
                path: "home",
                element: <Home />
            },
            {
                path:"createCompany",
                element:<CreateCompany/>
            },
            {
                path:"createUser",
                element:<CreateUser/>
            }
            ,
            {
                path:"allUsers",
                element:<AllUsers/>
            },
            {
                path:"allCompanys",
                element:<AllCompany/>
            }
        ]
    },
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "",
                element: <Login />
            }
        ]
    }
]);

export default router;
