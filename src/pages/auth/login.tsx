import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import styles from "./login.module.css"
const Login = () => {
  const {login,loading,message} = useAuth()
  const navigate = useNavigate();
  const [password,setPassword] = useState("")
  const [email,setEmail] = useState("")

  const handleLogin = async(e: React.FormEvent) =>{
    e.preventDefault()
    const user = {password, email}
    await login(user)

    if(!loading){
      const token = localStorage.getItem('authToken')
      if(token){
        navigate("/active/home")
      }else{
        console.error("Falha no login")
      }
    }
  }

  return (
    <div className={styles.container}>
    
    <form onSubmit={handleLogin} className={styles.form}>
    <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={styles.input}
        required
      />
      <button type="submit" disabled={loading} className={styles.button}>
        {loading ? "Entrando..." : "Entrar"}
      </button>

      {message && <p style={{ color:"red" }}>{message}</p>}
    </form>
  </div>
  )
}

export default Login