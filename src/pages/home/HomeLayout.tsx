import React from 'react'
import { Outlet } from "react-router-dom";
import Navbar from '../../components/navbar/navbar';

const HomeLayout = () => {
  return (
    <div>
      <Navbar/>
      <main>
        <Outlet/>
      </main>
        
    </div>
  )
}

export default HomeLayout
