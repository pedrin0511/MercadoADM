import { createContext, useState, useContext, ReactNode, Children } from "react";
import { API_backend } from '../config';


interface User{
    password:string
    email:string;
}

interface AuthContextType {
    user: User | null
    login:(userData: User) => void
    logout: () => void,
    loading:boolean
    message: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

 interface AuthProviderProps{
    children: ReactNode;
}

export  const AuthProvider = ({children}: AuthProviderProps) =>{
    const [user,setUser] = useState<User | null>(null)
    const [loading , setLoading] = useState<boolean>(false)
    const [message,setMessage] = useState<string | null>(null)

    const login = async(userData:User) =>{
        console.log(userData)
        setLoading(true);
        setMessage(null)

       try {
        const response = await fetch(`${API_backend}loginADM`,{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(userData),
        })

        const data = await response.json();

        if (response.status === 200) {
            // Salva o token no localStorage
            localStorage.setItem('authToken', data.token);
            setMessage(data.message)
            console.log("Login bem-sucedido!", data.message);
        } else {
            setMessage(data.error || "Erro ao fazer login")
            console.log(data.error);
        }
       } catch (error) {
        setMessage("Erro ao conectar ao servidor")
        console.error(error)
       } finally{
        setLoading(false)
       }
    }
    const logout = () =>{
        localStorage.removeItem("authToken")
        setUser(null)
        window.location.reload()
    }
    

    return(
        <AuthContext.Provider value={{user,login,logout,loading,message}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType =>{
    const context = useContext(AuthContext)

    if(!context){
        throw new Error("useAuth deve ser usado dentro de um AuthProvider")
    }

    return context
}
