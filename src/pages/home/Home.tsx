
import { Link } from "react-router-dom"

import styles from './Home.module.css'

import { FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import AllComponent from "../../components/allUsers/AllComponents";

const Home = () => {
  return (
    <div className={styles.containerHome} >
      <h1>Home</h1>
      <AllComponent
       storangeKey="AllUsers"
       link="/active/allUsers"
       icon={FaUser}
       label="usuários"
      />
      <AllComponent
       storangeKey="AllCompanys"
       link="/active/allCompanys"
       icon={FaBuilding}
       label="empresas"
      />
    </div>
  )
}

export default Home
