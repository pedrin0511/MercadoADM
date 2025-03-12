import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { API_backend } from '../config';


// Criando o Contexto
interface User {
    password: string;
    email: string;
    name: string;
    cep: string;
    cpf:string;
    cnpj:string;
    inscricaoEstadual: number | null;
    phone: string;
  }

interface CreateUserContextType{
    userData: User | null,
    register:(userData : User) => void
    formatarCPF:(cpf:string) => string
    formatarCnpj:(cnpj:string) => string
    formatarNumero:(phone:string) => void
    formatarCep:(cep:string) => void
    ApiCep:(cep:string) => void
    loading:boolean
    message: string | null
    messageError: string | null
    messageCep: string | null
    
}

const CreateUserContext = createContext<CreateUserContextType | undefined>(undefined)

interface CreateUserProviderProps{
    children: ReactNode;
}


// Provider para compartilhar os dados com os componentes filhos
export const UserProvider = ({children}:CreateUserProviderProps) => {
 const [user,setUser] = useState<User| null>(null)
 const [loading , setLoading] = useState<boolean>(false)
 const [message,setMessage] = useState<string| null>(null)
 const [messageError,setMessageError] = useState<string| null>(null)
 const [messageCep,setMessageCep] = useState<string| null>(null)


 const formatarCep = (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, ""); // Remove tudo que não é número
    if (cleanedCep.length > 7) {
      return `${cleanedCep.slice(0, 5)}-${cleanedCep.slice(5, 8)}`;
    }
    return cleanedCep; // Retorna sem formatação caso tenha menos de 5 dígitos
  };

  // Função para buscar CEP na API ViaCEP
  const ApiCep = async (cep: string) => {
    const formattedCep = formatarCep(cep);
    

    try {
      const response = await fetch(`https://viacep.com.br/ws/${formattedCep.replace("-", "")}/json/`);
      const data = await response.json();

      if (data.erro) {
        setMessageCep("CEP não encontrado");
        setTimeout(() =>{
          setMessageCep("")
        },3000)
      } else {
        console.log(`Endereço encontrado: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`)
        setMessageCep(`${data.localidade} - ${data.uf}`);
        
        // Atualiza automaticamente o usuário com cidade e estado
        setUser((prevUser) => 
          prevUser ? { ...prevUser, cep: formattedCep, name: prevUser.name } : null
        );
      }
    } catch (error) {
      setMessageCep("Erro ao buscar o CEP, tente novamente");
    } finally {
      setLoading(false);
    }
  };


 const register = async(userData:User)=>{
    console.log(userData)
    setUser(userData)
    setLoading(true);
    setMessage(null)

    try {
        const response = await fetch(`${API_backend}createUser`,{
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(userData)
        })

        const data = await response.json()

        if(response.status === 200){
            setMessage('Conta criada com sucesso')

            setTimeout(() =>{
              setMessage('')
            },3000)
            console.log("Login bem-sucedido!", data.message);
            
        }else{
            setMessageError(data.error || 'erro ao criar conta')
            setTimeout(() =>{
              setMessageError("")
            },3000)
        }
    } catch (error) {
        setMessageError("Erro ao conectar ao servidor")
        setTimeout(() =>{
          setMessageError("")
        },3000)
        console.error(error)
    }finally{
        setLoading(false)
    }
}



const formatarCnpj=(cnpj:string)=>{

    const cleanedCNPJ = cnpj.replace(/\D/g, "");

  // Se o CNPJ tiver mais de 14 números, apenas considera os 14 primeiros
  const formattedCNPJ = cleanedCNPJ
    .slice(0, 14) // Limita a 14 caracteres
    .replace(/(\d{2})(\d{3})/, "$1.$2")
    .replace(/(\d{3})(\d{3})/, "$1.$2")
    .replace(/(\d{3})(\d{4})/, "$1/$2")
    .replace(/(\d{4})(\d{2})$/, "$1-$2");

  return formattedCNPJ;
}

const formatarCPF=(cpf:string)=>{
    const cleanedCPF = cpf.replace(/\D/g, "");

  // Se o CPF tiver mais de 11 números, apenas considera os 11 primeiros
  const formattedCPF = cleanedCPF
    .slice(0, 11) // Limita a 11 caracteres
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  return formattedCPF;
}

const formatarNumero = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, ""); // Remove tudo que não é número
  
    if (cleanedPhone.length <= 2) {
      return cleanedPhone; // Retorna apenas o DDD enquanto digita
    }
    if (cleanedPhone.length <= 6) {
      return `(${cleanedPhone.slice(0, 2)}) ${cleanedPhone.slice(2)}`; // Adiciona parênteses no DDD
    }
    return `(${cleanedPhone.slice(0, 2)}) ${cleanedPhone.slice(2, 6)}-${cleanedPhone.slice(6, 10)}`; // Adiciona hífen após o 6º dígito
  };


  return (
     <CreateUserContext.Provider value={{ userData: user, register,formatarCPF,formatarCnpj,formatarNumero, formatarCep,loading,message,messageError,messageCep,ApiCep}}>
            {children}
        </CreateUserContext.Provider>
  );
};



// Hook para facilitar o consumo do contexto
export const useCreateUser = (): CreateUserContextType =>{
    const context = useContext(CreateUserContext)
    
        if(!context){
            throw new Error("useAuth deve ser usado dentro de um AuthProvider")
        }
    
        return context
}
