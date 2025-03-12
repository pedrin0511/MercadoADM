import React, { useState } from "react";
import { useCreateUser } from "../../../context/CreateUserProvider";
import styles from './CreateUser.module.css'


const CreateUser = () => {

  const { register,formatarCPF,formatarCnpj,formatarNumero,formatarCep,ApiCep, message,messageError,messageCep,loading} = useCreateUser();
    
  // Estado do formulário
  const [user, setUser] = useState({
      name: "",
      email: "",
      password: "",
      cep: "",
      cpf: "",
      cnpj: "",
      inscricaoEstadual: null,
      phone: "",
      documentType: "cpf", // Variável para escolher entre CPF ou CNPJ
  });


  const handleDocumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      documentType: value,
      cpf: value === 'cnpj' ? "" : prevUser?.cpf || "", // Limpa o CPF ou CNPJ ao mudar o tipo
      cnpj: value === 'cpf' ? "" : prevUser?.cnpj || "", // Limpa o CNPJ ou CPF ao mudar o tipo
    }));
  };
  
  // Função comum para formatar CPF e CNPJ
  const formatarDocumento = (value: string, type: 'cpf' | 'cnpj' | 'phone' | 'cep') => {
    if (type === 'cpf') {
      return formatarCPF(value);
    } else if (type === 'cnpj') {
      return formatarCnpj(value);
    }else if(type === 'phone'){
      return formatarNumero(value)
    }else if(type === 'cep'){
      return formatarCep(value)
    }
    return value;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const formattedValue = name === 'cpf' || name === 'cnpj' || name === 'phone' || name === 'cep'
      ? formatarDocumento(value, name) || "" // Garante string
      : value;
  
    setUser((prevUser) => ({
      ...prevUser,
      [name]: formattedValue,
    }));
  
    // Se for CEP e tiver 8 dígitos, chama a API
    if (name === 'cep' && (formattedValue ?? "").replace(/\D/g, "").length === 8) {
      ApiCep(formattedValue);
    }
  };
  
  // Função de envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const isValidCpf = user?.cpf && user.cpf.replace(/\D/g, "").length === 11;
    const isValidCnpj = user?.cnpj && user.cnpj.replace(/\D/g, "").length === 14;
    const isValidPhone = user?.phone && user.phone.replace(/\D/g, "").length === 10;
    const isValidPassword = user?.password && user.password.length >= 6; // Alterado para >= 6
  
    if (!isValidPassword) {
      alert("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }
  
    if (
      (user?.documentType === "cpf" && !isValidCpf) ||
      (user?.documentType === "cnpj" && !isValidCnpj) ||
      (user?.documentType === "phone" && !isValidPhone)
    ) {
      alert(
        user?.documentType === "cpf"
          ? "O CPF deve ter exatamente 11 números."
          : user?.documentType === "cnpj"
          ? "O CNPJ deve ter exatamente 14 números."
          : "O telefone deve ter exatamente 10 números."
      );
      return;
    }
  
    register(user);
  };

  return (
      <div className={styles.container}>
          <h1>Cadastrar novo usuário</h1>
          <form onSubmit={handleSubmit}>
              <div>
                  <label>Nome:</label>
                  <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      required
                  />
              </div>
              <div>
                  <label>Email:</label>
                  <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                  />
              </div>
              <div>
                  <label>Senha:</label>
                  <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      required
                  />
              </div>
              <div>
                  <label>CEP:</label>
                  <input
                    type="text"
                    name="cep"
                    value={user.cep !== null ? user.cep : ''}  // Usa uma string vazia se o valor for null
                    onChange={handleChange}
                    required
                  />
                  {messageCep && <p>{messageCep}</p>}
              </div>
              <div>
                  <label>Telefone:</label>
                  <input
                      type="text"
                      name="phone"
                      value={user.phone !==null ? user.phone : ''}
                      onChange={handleChange}
                      required
                  />
              </div>

              {/* Seleção de tipo de documento */}
              <div>
                  <label>Tipo de documento:</label>
                  <select name="documentType" onChange={handleDocumentChange} value={user.documentType}>
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                  </select>
              </div>

              {/* Campo CPF */}
              {user.documentType === "cpf" && (
                  <div>
                      <label>CPF:</label>
                    <input
                    type="text"
                    name="cpf"
                    value={user?.cpf || ""}
                    onChange={handleChange}
                    required // Chama a função formatarCPF quando o usuário digita
                />
                  </div>
              )}

              {/* Campo CNPJ */}
              {user.documentType === "cnpj" && (
                  <div>
                      <label>CNPJ:</label>
                      <input
                          type="text"
                          name="cnpj"
                          value={user.cnpj || ""}
                          onChange={handleChange}
                          required
                      />
                  </div>
              )}

              {/* Inscrição Estadual */}
              <div>
                  <label>Inscrição Estadual:</label>
                  <input
                      type="number"
                      name="inscricaoEstadual"
                      value={user.inscricaoEstadual || ""}
                      onChange={handleChange}
                      required
                  />
              </div>
              {message && <p className={styles.sucess}>{message}</p>}
              {messageError && <p className={styles.error}>{messageError}</p>}
              <button type="submit" disabled={loading}>
              {loading ? <p>Carregando...</p> : <p>Cadastrar</p>}
            </button>

          </form>
      </div>
  );
}

export default CreateUser
