
import { IoIosReturnLeft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import styles  from "./buttons.module.css"

const Return = () => {
    const navigate = useNavigate()
    const ReturnPage = () =>{
        navigate(-1)
    }

  return (
    <button className={styles.buttonRetunr} onClick={ReturnPage}><IoIosReturnLeft /></button>
  )
}

export default Return
