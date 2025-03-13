import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import styles from './AllComponents.module.css'
import { FaUser } from "react-icons/fa";


const AllComponent = ({storangeKey,link,icon:Icon,label}) => {
const [total, setTotal] = useState(0)

useEffect(()=>{
  const cachedData = localStorage.getItem(storangeKey);
  
  if(cachedData){
    const DataArray = JSON.parse(cachedData)
    setTotal(DataArray.length) 
  }
  
},[storangeKey])
  
  return (
    <div className={styles.container_AllComponents}>
      <Link to={link}>Ver {label}</Link>
      <Icon/>{total}
    </div>
  )
}

export default AllComponent