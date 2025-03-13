import React, { useState } from "react";
import { useCreateUser } from "../../../context/CreateUserProvider";
import styles from '../CreateUser/CreateUser.module.css'
import { Link } from "react-router-dom";
import Return from "../../../components/buttons/Return";


const CreateCompany = () => {

  const { registerCompany,formatarCnpj,formatarNumero,formatarCep,ApiCep, message,messageError,messageCep,loading} = useCreateUser();
    
  // Estado do formulário
  const [company, setCompany] = useState({
      name: "",
      email: "",
      password: "",
      cep: "",
      cnpj: "",
      inscricaoEstadual: null,
      phone: "",
  });

  
  // Função comum para formatar CPF e CNPJ
  const formatarDocumento = (value: string, type:  'cnpj' | 'phone' | 'cep') => {
     if (type === 'cnpj') {
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
    const formattedValue = name === 'cnpj' || name === 'phone' || name === 'cep'
      ? formatarDocumento(value, name) || "" // Garante string
      : value;
  
    setCompany((prevUser) => ({
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

  const isValidCnpj =
    company?.cnpj && company.cnpj.replace(/\D/g, "").length === 14;
  const isValidPhone =
    company?.phone && company.phone.replace(/\D/g, "").length === 10;
  const isValidPassword = company?.password && company.password.length >= 6; // Alterado para >= 6

  if (!isValidPassword) {
    alert("A senha precisa ter no mínimo 6 caracteres.");
    return;
  }

  if (!isValidCnpj) {
    alert("O CNPJ deve ter exatamente 14 números.");
    return;
  }

  if (!isValidPhone) {
    alert("O telefone deve ter exatamente 10 números.");
    return;
  }

  registerCompany(company);
};


  return (
    <div className={styles.Empresa}>
      <div className={styles.container}>
        <Return/>
          <h1>Cadastrar uma nova empresa</h1>
          <Link to="/active/allCompanys">Ver todos as empresas</Link>
          <form onSubmit={handleSubmit}>
              <div>
                  <label>Nome:</label>
                  <input
                      type="text"
                      name="name"
                      value={
                        company.name}
                      onChange={handleChange}
                      required
                  />
              </div>
              <div>
                  <label>Email:</label>
                  <input
                      type="email"
                      name="email"
                      value={
                        company.email}
                      onChange={handleChange}
                      required
                  />
              </div>
              <div>
                  <label>Senha:</label>
                  <input
                      type="password"
                      name="password"
                      value={
                        company.password}
                      onChange={handleChange}
                      required
                  />
              </div>
              <div>
                  <label>CEP:</label>
                  <input
                    type="text"
                    name="cep"
                    value={
                      company.cep !== null ? 
                      company.cep : ''}  // Usa uma string vazia se o valor for null
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
                      value={
                        company.phone !==null ? 
                        company.phone : ''}
                      onChange={handleChange}
                      required
                  />
              </div>

                  <div>
                      <label>CNPJ:</label>
                    <input
                    type="text"
                    name="cnpj"
                    value={
                      company?.cnpj || ""}
                    onChange={handleChange}
                    required // Chama a função formatarCPF quando o usuário digita
                />
                  </div>
             

              {/* Inscrição Estadual */}
              <div>
                  <label>Inscrição Estadual:</label>
                  <input
                      type="number"
                      name="inscricaoEstadual"
                      value={
                        company.inscricaoEstadual || ""}
                      onChange={handleChange}
                      required
                  />
              </div>
              {message && <p className={styles.sucess}>{message}</p>}
              {messageError && <p className={styles.error}>{messageError}</p>}
              <button className={styles.button} type="submit" disabled={loading}>
              {loading ? <p>Carregando...</p> : <p>Cadastrar</p>}
            </button>

          </form>
      </div>
      </div>
  );
}

export default CreateCompany
