import { useEffect, useState } from 'react'
import { get, post, del } from '../src/lib/api'
import { getToken } from '../src/lib/auth'

export default function Admin(){
  const [emails,setEmails]=useState<string[]>([])
  const [newEmail,setNewEmail]=useState('')

  useEffect(()=>{ load() },[])
  function load(){ get('/api/v1/admin/allowed-emails').then((r:any)=> setEmails(r.items ? r.items.map((it:any)=>it.email) : [])).catch(()=>{}) }

  async function add(e:any){ e.preventDefault(); const token = getToken(); if(!newEmail) return; try{ await post('/api/v1/admin/allowed-emails', { email: newEmail }, token || undefined); setNewEmail(''); load(); }catch(err:any){ alert('err '+err.message) } }
  async function remove(email:string){ const token = getToken(); if(!confirm('Remove '+email+'?')) return; try{ await del(`/api/v1/admin/allowed-emails/${email}`, token || undefined); load() }catch(err:any){ alert('err '+err.message) } }

  return (
    <div>
      <h2>Admin — Allowed Emails</h2>
      <div className="card">
        <form onSubmit={add}>
          <input className="input" placeholder="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} />
          <button className="btn" style={{marginLeft:8}} type="submit">Add</button>
        </form>
      </div>

      <div className="card">
        <h3>Allowed Emails</h3>
        <table className="table"><thead><tr><th>Email</th><th></th></tr></thead>
          <tbody>{emails.map(em=> (<tr key={em}><td>{em}</td><td><button className="btn" onClick={()=>remove(em)}>Remove</button></td></tr>))}</tbody></table>
      </div>
    </div>
  )
}
