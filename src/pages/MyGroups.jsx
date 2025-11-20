import { useEffect, useState } from "react";
import './MyGroups.css'
import Management from "./Management";

function MyGroups() {




  return (
    <section className='mygroups-page' >

      <div className='mygroups-header'>

      </div>

      <div className='mygroups-body'>
        <div className='mg-lists'>

        </div>

        <div className="mg-info">
              <Management />
        </div>
      </div>
    </section>
  )
}

export default MyGroups;