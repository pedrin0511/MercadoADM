import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js";
import { useCreateUser } from "../../context/CreateUserProvider";
import { API_backend } from "../../config";
import Return from "../../components/buttons/Return";
import styles from '../users/AllUsers.module.css'
const supabase = createClient('https://emrjrmzevstbmlurreff.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcmpybXpldnN0Ym1sdXJyZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTkzOTAsImV4cCI6MjA1NjkzNTM5MH0.LyOva7qCa9ulUE06SAOLQTY_6Lh-dAqSymd171yM7q8')


const AllCompany = () => {
    const [companys,setcompanys] = useState([])
    const [page,setPage] = useState(0)
    const limit = 5

    useEffect(() => {
        const cachedUsers = localStorage.getItem("AllCompanys");
    
        if (cachedUsers) {
          setcompanys(JSON.parse(cachedUsers));
        } else {
          fetchAllCompany();
        }
      }, []);
    
  const AtualizarCompany = () =>{
    localStorage.removeItem("AllCompanys")
  
    setcompanys([])
  
    fetchAllCompany(0,true)
    window.location.reload()
  }

    const fetchAllCompany = async (currentPage = 0, reset = false) => {
        const start = reset ? 0 : currentPage * limit;
        const end = start + limit - 1;
      
        const { data, error } = await supabase
          .from("companys")
          .select("*")
          .order("created_at", { ascending: false })
          .range(start, end);
      
        if (error) {
          console.error("Erro ao buscar usuários", error);
        } else {
          console.log("Buscando no banco", data);
      
          setcompanys(reset ? data : [...companys, ...data]);
          localStorage.setItem("AllCompanys", JSON.stringify(reset ? data : [...companys, ...data]));
        }
      };


  return (
    <div className={styles.container}>
    <Return/>
        <h1 className={styles.title}>Todas as empresas cadastradas</h1>
        <button className={styles.verMais} onClick={AtualizarCompany}>Atualizar Empresas</button>
        {companys.length === 0 ? <p>Nenhuma empresa cadastrada!</p>:
        <ul className={styles.userList}>
        {companys.map((compnay) => (
            <li key={compnay.id} className={styles.cardUser}>
            <div className={styles.userInfo}>
                <p className={styles.userName}>
                <strong>Nome:</strong> {compnay.name}
                </p>
                <p className={styles.userEmail}>
                <strong>Email:</strong> {compnay.email}
                </p>
                <p className={styles.userPhone}>
                <strong>Telefone:</strong> {compnay.phone}
                </p>
            </div>
            <div className={styles.userDetails}>
                <p className={styles.userCNPJCPF}>
                <strong>CNPJ:</strong> {compnay.cnpj}
                </p>
                <p className={styles.userInscricao}>
                <strong>Inscrição Estadual:</strong> {compnay.inscricaoEstadual}
                </p>
                <p className={styles.userCEP}>
                <strong>CEP:</strong> {compnay.cep}
                </p>
            </div>
            </li>
        ))}
        
        </ul>}

    </div>
  )
}

export default AllCompany
