import { useAuth } from "../../context/AuthProvider"
import styles  from "./buttons.module.css"

const Logout = () => {
const {logout} = useAuth()

const handleLogout =() =>{
    logout()
}
  return (
    <button className={styles.logoutButton} onClick={handleLogout}>
        Sair
    </button>
  )
}

export default Logout
