import { RouterProvider } from "react-router-dom";
import {AuthProvider}  from "./context/AuthProvider"
import router from "./router"
import { UserProvider } from "./context/CreateUserProvider";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <RouterProvider router={router}/>
      </UserProvider>
        
    </AuthProvider>
  );
}

export default App;
