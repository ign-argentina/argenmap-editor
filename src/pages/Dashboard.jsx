import { useUser } from "../context/UserContext";

function Dashboard() {
  const { logout, setGroupAdmin, setSuperAdmin, superAdmin } = useUser()


  
  return (
    <>
    
    {superAdmin ? (<h1>Hola Superadmin</h1>) : null}
    </>
  )
}

export default Dashboard