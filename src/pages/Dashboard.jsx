import { useUser } from "../context/UserContext";

function Dashboard() {
  const { logout, setGroupAdmin, setSuperAdmin, superAdmin } = useUser()


  
  return (
    <>
    
    {superAdmin ? (<h1>Feature en construccion...</h1>) : null}
    </>
  )
}

export default Dashboard