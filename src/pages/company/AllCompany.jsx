import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js";
import { useCreateUser } from "../../context/CreateUserProvider";
import { API_backend } from "../../config";
import Return from "../../components/buttons/Return";
import styles from '../users/AllUsers.module.css'
import { MdEdit } from "react-icons/md";
import AllComponent from "../../components/allUsers/AllComponents";
import { FaUser } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";

const supabase = createClient('https://emrjrmzevstbmlurreff.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcmpybXpldnN0Ym1sdXJyZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTkzOTAsImV4cCI6MjA1NjkzNTM5MH0.LyOva7qCa9ulUE06SAOLQTY_6Lh-dAqSymd171yM7q8')


const AllCompany = () => {
  const {formatarCnpj,formatarNumero,formatarCep,ApiCep,messageCep,} = useCreateUser();
    const [companys,setcompanys] = useState([])
    const [editing,setEditing] =useState(false)
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [updatedCompany, setUpdatedCompany] = useState({});
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

  const VerMais = async () => {
    const newPage = page + 1; // Calcula o novo valor antes de atualizar o estado
    setPage(newPage);
    fetchAllCompany(newPage); // Passa o valor atualizado diretamente
  };

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

      const edit = (company) => {
        setSelectedCompany(company);
        setUpdatedCompany(company); // Preenche os campos com os dados do usuário clicado
        setEditing(true);
      };

      const formatarDocumento = (value, type) => {
        if (type === 'cnpj') return formatarCnpj(value);
        if (type === 'phone') return formatarNumero(value);
        if (type === 'cep') return formatarCep(value);
        return value;
      };
      
      const handleChange = (e) => {
        const { name, value } = e.target;
      
        // Aplica a formatação conforme o tipo de dado
        const formattedValue =
          name === 'cnpj' || name === 'phone' || name === 'cep'
            ? formatarDocumento(value, name) || ""
            : value;
      
        setUpdatedCompany({ ...updatedCompany, [name]: formattedValue });
      
        // Chama a API apenas se for um CEP válido (8 números)
        if (name === 'cep' && formattedValue.replace(/\D/g, "").length === 8) {
          ApiCep(formattedValue);
        }
      };
      
      const editUser = async (e) => {
        e.preventDefault();
      
        try{
            const response = await fetch(`${API_backend}editingCompany`,{
              method:'POST',
              headers:{
                  'Content-Type' : 'application/json',
              },
              body: JSON.stringify(updatedCompany)
            })
      
            if(response.status === 200){
              alert('Conta atualizada')
            }else{
              alert('Erro ao atualizar a conta')
            }
        }catch(error){
          console.error('Não foi possivel editar o usuario')
        }
        console.log("Dados atualizados:", updatedCompany);
        setEditing(false);
      };
  return (
    <div className={styles.container}>
    <Return/>
        <h1 className={styles.title}>Todas as empresas cadastradas</h1>
        <AllComponent
        storangeKey="AllUsers"
               link="/active/allUsers"
               icon={FaUser}
               label="usuários"
        />
        <button className={styles.verMais} onClick={AtualizarCompany}>Atualizar Empresas</button>
        {companys.length === 0 ? <p>Nenhuma empresa cadastrada!</p>:
        <ul className={styles.userList}>
        {companys.map((compnay) => (
            <li key={compnay.id} className={styles.cardUser}>
              <div className={styles.iconEddit}>
                <span><Link to={`/active/createProduct/${compnay.id}`}><IoIosAddCircle /></Link></span>
                <span><MdEdit onClick={() => edit(compnay)}/></span>
              </div>
               
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
        <button className={styles.verMais} onClick={VerMais}>Ver mais</button>
        </ul>}
        {editing && selectedCompany && (
        <div className={styles.modalBackground} onClick={() => setEditing(false)}>
          <div className={styles.editCard} onClick={(e) => e.stopPropagation()}>
            <h1>Editar perfil</h1>
            <form onSubmit={editUser} className={styles.form}>
              <label>
                Nome:
                <input type="text" name="name" value={updatedCompany.name} onChange={handleChange} />
              </label>
              <label>
                Telefone:
                <input type="text" name="phone" value={updatedCompany.phone} onChange={handleChange} />
              </label>
              <label>
              CNPJ:
              <input type="text" name={'cnpj'}  value={updatedCompany.cnpj} onChange={handleChange}/>
              </label>
              <label>
                Inscrição Estadual:
                <input type="text" name="inscricaoEstadual" value={updatedCompany.inscricaoEstadual} onChange={handleChange} />
              </label>
              <label>
                CEP:
                <input type="text" name="cep" value={updatedCompany.cep} onChange={handleChange} />
              </label>
              {messageCep && <p>{messageCep}</p>}

              
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveButton}>Salvar</button>
                <button type="button" className={styles.cancelButton} onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}

export default AllCompany
