import { useEffect, useState } from "react";
import './MyGroups.css'
import Management from "./Management";
import { getManageGroups } from "../api/groups";

function MyGroups() {

  const [showGroupList, setShowGroupList] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [groupList, setGroupList] = useState([])

  const grupos = [{ id: "x", nombre: "Mockeado 1" }, { id: "x", nombre: "Mockeado 2" }, { id: "x", nombre: "Mockeado 3" }]
  const invitaciones = [{ id: "x", nombre: "Invitacion" }]


  useEffect(() => {
    getManageGroups().then(setGroupList)
  }, [])
  return (
    <section className='mygroups-page' >

      <div className='mygroups-header'>
        <h1>Mis grupos</h1>
      </div>

      <div className='mygroups-body'>
        <div className='mg-lists'>
          <div className="mg-list-header">
            <button onClick={() => setShowGroupList(true)}> Mis grupos</button>
            <button onClick={() => setShowGroupList(false)}>Invitaciones</button>
          </div>
          <div className="mg-list-body">

            {showGroupList ? groupList.map((grupo, idx) => (
              <button key={idx} onClick={() => setSelectedGroup(grupo)} className="mg-group-btn">
                {grupo.name}
              </button>
            )) :
              invitaciones.map((invitacion, idx) => (
                <button key={idx} className="mg-group-btn">
                  {invitacion.nombre}
                </button>
              ))}
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