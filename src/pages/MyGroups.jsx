import { useEffect, useState } from "react";
import './MyGroups.css'
import Management from "./Management";
import { getManageGroups, getGrupos } from "../api/groups";

function MyGroups() {

  const [showGroupList, setShowGroupList] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groupList, setGroupList] = useState([])

  const invitaciones = [{ id: "x", nombre: "Invitacion" }]


  useEffect(() => {
 /*    getManageGroups().then(setGroupList) */
    getGrupos().then(setGroupList)
  }, [])
  return (
    <section className='mygroups-page' >

      <div className='mygroups-header'>
        <h1>{/* ALGO */}</h1>
      </div>

      <div className='mygroups-body'>
        <div className='mg-lists'>
          <div className="mg-list-header">
            <button onClick={() => setShowGroupList(true)}> Mis grupos</button>
            {/* <button onClick={() => setShowGroupList(false)}>Invitaciones</button> */}
          </div>
          <div className="mg-list-body">

            {showGroupList ? (
              groupList.length > 0 ? (
                groupList.map((grupo, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedGroup(grupo)} 
                    className={selectedGroup?.id === grupo.id ? "mg-group-btn active" : "mg-group-btn"}
                  >
                    {grupo.name}
                  </button>
                ))
              ) : (
                <div>No perteneces a ningún grupo</div>
              )
            ) : (
              invitaciones.length > 0 ? (
                invitaciones.map((invitacion, idx) => (
                  <button key={idx} className="mg-group-btn">
                    {invitacion.nombre}
                  </button>
                ))
              ) : (
                <div>No hay invitaciones pendientes</div>
              )
            )}
          </div>

        </div>

        <div className="mg-info">
          <Management group={selectedGroup} />
        </div>
      </div>
    </section>
  )
}

export default MyGroups;