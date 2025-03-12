
import { Link } from "react-router-dom"
const Home = () => {
  return (
    <div>
      <h1>Home</h1>
      <Link to="/active/allUsers">Ver todos os usuarios</Link>
    </div>
  )
}

export default Home
