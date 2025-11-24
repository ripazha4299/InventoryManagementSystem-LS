import { useEffect, useState } from 'react'
import { get, post } from '../src/lib/api'
import { getToken } from '../src/lib/auth'

export default function Keys(){
  const [keys,setKeys]=useState<any[]>([])
  const [toName,setToName]=useState('')
  const [toRoll,setToRoll]=useState('')
  const [selectedKey,setSelectedKey]=useState('')

  useEffect(()=>{ load() },[])
  function load(){ get('/api/v1/keys').then((r:any)=> setKeys(r.keys || [])).catch(()=>{}) }

  async function handover(e:any){ e.preventDefault(); const token = getToken(); if(!selectedKey) return alert('select')
    const payload = { to_holder: { name: toName, roll: toRoll }, notes: 'handover from UI' }
    try{ await post(`/api/v1/keys/${selectedKey}/handover`, payload, token || undefined); alert('ok'); load() }catch(err:any){ alert('err '+err.message) }
  }

  return (
    <div>
      <h2>Keys</h2>
      <div className="card">
        <table className="table"><thead><tr><th>Name</th><th>Holder</th></tr></thead>
          <tbody>{keys.map(k=>(<tr key={k.id}><td>{k.keyName}</td><td>{k.currentHolder?.name}</td></tr>))}</tbody></table>
      </div>

      <div className="card">
        <h3>Hand Over Key</h3>
        <form onSubmit={handover}>
          <select className="input" value={selectedKey} onChange={e=>setSelectedKey(e.target.value)}>
            <option value="">Select key</option>
            {keys.map(k=>(<option key={k.id} value={k.id}>{k.keyName}</option>))}
          </select>
          <div style={{height:8}} />
          <input className="input" placeholder="To name" value={toName} onChange={e=>setToName(e.target.value)} />
          <div style={{height:8}} />
          <input className="input" placeholder="To roll" value={toRoll} onChange={e=>setToRoll(e.target.value)} />
          <div style={{height:8}} />
          <button className="btn" type="submit">Handover</button>
        </form>
      </div>
    </div>
  )
}
