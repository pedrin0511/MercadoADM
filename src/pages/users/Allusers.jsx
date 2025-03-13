import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js";
import styles from './AllUsers.module.css'
import { useCreateUser } from "../../context/CreateUserProvider";
import { API_backend } from "../../config";
import Return from "../../components/buttons/Return";
const supabase = createClient('https://emrjrmzevstbmlurreff.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcmpybXpldnN0Ym1sdXJyZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNTkzOTAsImV4cCI6MjA1NjkzNTM5MH0.LyOva7qCa9ulUE06SAOLQTY_6Lh-dAqSymd171yM7q8')

const AllUsers = () => {
  const {formatarCPF,formatarCnpj,formatarNumero,formatarCep,ApiCep, message,messageError,messageCep,loading} = useCreateUser();
    const [users,setUsers] = useState([])
    const [editing,setEditing] =useState(false)
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [filteredUsers, setFilteredUsers] = useState([]); // Estado para usuários filtrados
    const [page,setPage] = useState(0)
    const limit = 5

    useEffect(() => {
      const cachedUsers = localStorage.getItem("AllUsers");
  
      if (cachedUsers) {
        setUsers(JSON.parse(cachedUsers));
      } else {
        fetchAllUsers();
      }
    }, []);
  
const AtualizarUsers = () =>{
  localStorage.removeItem("AllUsers")

  setUsers([])

  fetchAllUsers(0,true)
  window.location.reload()
}
    

const VerMais = async () => {
  const newPage = page + 1; // Calcula o novo valor antes de atualizar o estado
  setPage(newPage);
  fetchAllUsers(newPage); // Passa o valor atualizado diretamente
};

const fetchAllUsers = async (currentPage = 0, reset = false) => {
  const start = reset ? 0 : currentPage * limit;
  const end = start + limit - 1;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    console.error("Erro ao buscar usuários", error);
  } else {
    console.log("Buscando no banco", data);

    setUsers(reset ? data : [...users, ...data]);
    localStorage.setItem("AllUsers", JSON.stringify(reset ? data : [...users, ...data]));
  }
};


const edit = (user) => {
  setSelectedUser(user);
  setUpdatedUser(user); // Preenche os campos com os dados do usuário clicado
  setEditing(true);
};

// Função para formatar dinamicamente os valores de entrada
const formatarDocumento = (value, type) => {
  if (type === 'cpf') return formatarCPF(value);
  if (type === 'cnpj') return formatarCnpj(value);
  if (type === 'phone') return formatarNumero(value);
  if (type === 'cep') return formatarCep(value);
  return value;
};

const handleChange = (e) => {
  const { name, value } = e.target;

  // Aplica a formatação conforme o tipo de dado
  const formattedValue =
    name === 'cpf' || name === 'cnpj' || name === 'phone' || name === 'cep'
      ? formatarDocumento(value, name) || ""
      : value;

  setUpdatedUser({ ...updatedUser, [name]: formattedValue });

  // Chama a API apenas se for um CEP válido (8 números)
  if (name === 'cep' && formattedValue.replace(/\D/g, "").length === 8) {
    ApiCep(formattedValue);
  }
};

const editUser = async (e) => {
  e.preventDefault();

  try{
      const response = await fetch(`${API_backend}editingUser`,{
        method:'POST',
        headers:{
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(updatedUser)
      })

      if(response.status === 200){
        alert('Conta atualizada')
      }else{
        alert('Erro ao atualizar a conta')
      }
  }catch(error){
    console.error('Não foi possivel editar o usuario')
  }
  console.log("Dados atualizados:", updatedUser);
  setEditing(false);
};

const deleteUser = async (id) => {
  const isConfirmed = window.confirm("Tem certeza que deseja excluir esse usuário?");
  console.log(id);

  if (!isConfirmed) return;

  try {
    const response = await fetch(`${API_backend}/deleteUser/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json(); // Aqui você pega o conteúdo da resposta

    if (response.ok) {
      // Verifica se a resposta foi bem-sucedida (status 200-299)
      setEditing(false);
      alert("Usuário excluído com sucesso!");
      AtualizarUsers();
    } else {
      // Caso haja algum erro, mostre o erro específico retornado do servidor
      console.error('Erro no backend:', data.error || 'Erro desconhecido');
      throw new Error(data.error || 'Erro ao deletar usuário');
    }
  } catch (error) {
    console.error('Não foi possível deletar o usuário', error);
  }
};

  return (
    <div className={styles.container}>
      <Return/>
  <h1 className={styles.title}>Todos os usuários cadastrados</h1>
  <button className={styles.verMais} onClick={AtualizarUsers}>Atualizar Usuários</button>
  {users.length === 0 ? <p>Nenhum usuário cadastrado!</p>:
  <ul className={styles.userList}>
    {users.map((user) => (
      <li key={user.id} className={styles.cardUser} onClick={() => edit(user)}>
        <div className={styles.userInfo}>
          <p className={styles.userName}>
            <strong>Nome:</strong> {user.name}
          </p>
          <p className={styles.userEmail}>
            <strong>Email:</strong> {user.email}
          </p>
          <p className={styles.userPhone}>
            <strong>Telefone:</strong> {user.phone}
          </p>
        </div>
        <div className={styles.userDetails}>
          <p className={styles.userCNPJCPF}>
            <strong>{user.cpf ? "CPF" : "CNPJ"}:</strong> {user.cnpj || user.cpf}
          </p>
          <p className={styles.userInscricao}>
            <strong>Inscrição Estadual:</strong> {user.inscricaoEstadual}
          </p>
          <p className={styles.userCEP}>
            <strong>CEP:</strong> {user.cep}
          </p>
        </div>
      </li>
    ))}
    <button className={styles.verMais} onClick={VerMais}>Ver mais</button>
  </ul>}
  
  
  {editing && selectedUser && (
        <div className={styles.modalBackground} onClick={() => setEditing(false)}>
          <div className={styles.editCard} onClick={(e) => e.stopPropagation()}>
            <h1>Editar perfil</h1>
            <form onSubmit={editUser} className={styles.form}>
              <label>
                Nome:
                <input type="text" name="name" value={updatedUser.name} onChange={handleChange} />
              </label>
              <label>
                Telefone:
                <input type="text" name="phone" value={updatedUser.phone} onChange={handleChange} />
              </label>
              <label>
              {selectedUser.cnpj ? 'CNPJ' : 'CPF'}:
              <input type="text" name={selectedUser.cnpj ? 'cnpj' : 'cpf'}  value={updatedUser.cnpj? updatedUser.cnpj:updatedUser.cpf} onChange={handleChange}/>
              </label>
              <label>
                Inscrição Estadual:
                <input type="text" name="inscricaoEstadual" value={updatedUser.inscricaoEstadual} onChange={handleChange} />
              </label>
              <label>
                CEP:
                <input type="text" name="cep" value={updatedUser.cep} onChange={handleChange} />
              </label>
              {messageCep && <p>{messageCep}</p>}

              
              <div className={styles.buttonGroup}>
                <button type="submit" className={styles.saveButton}>Salvar</button>
                <button type="button" className={styles.cancelButton} onClick={() => setEditing(false)}>Cancelar</button>
              </div>
            </form>
            <button onClick={() => deleteUser(selectedUser.id)} className={styles.cancelButton}>Excluir {updatedUser.name}</button>
          </div>
        </div>
      )}
</div>
  )
}

export default AllUsers

