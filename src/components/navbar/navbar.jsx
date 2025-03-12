import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { IoMdPersonAdd, IoMdAddCircle, IoMdMenu, IoMdHome } from "react-icons/io";
import styles from "./navbar.module.css";
import Logout from "../buttons/logout";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null)
  const navbarRef = useRef(null)

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() =>{
    const handleClick = (e) =>{
      if(navbarRef.current && !navbarRef.current.contains(e.target)){
        setOpen(false)
      }
    }

    document.addEventListener("mousedown",handleClick)

    return()=>{
      document.removeEventListener("mousedown", handleClick)
    }

  },[])


  return (
    <nav ref={navbarRef} className={styles.containerNav}>
      <div>
        <NavLink className={styles.home} to="/active/home">Home</NavLink>
       
        <div onClick={handleOpen}>
          <IoMdMenu />
        </div>
      </div>

      {/* Links de navegação - ambos para desktop e mobile */}
      <ul ref={menuRef} className={open ? styles.open : ""}>
        <li>
          <NavLink to="/active/home" className={({isActive}) => isActive ? styles.active : undefined}><IoMdHome/>Home</NavLink>
        </li>
        <li>
          <NavLink to="/active/createUser" className={({isActive}) => isActive ? styles.active : undefined}>
            <span><IoMdPersonAdd /></span>Cadastrar usuário
          </NavLink>
        </li>
        <li>
          <NavLink to="/active/createCompany" className={({isActive}) => isActive ? styles.active : undefined}>
            <span><IoMdAddCircle /></span>Cadastrar empresa
          </NavLink>
        </li>
        <li>
          <Logout/>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
