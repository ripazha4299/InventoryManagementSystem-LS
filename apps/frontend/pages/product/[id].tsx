import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { get, patch } from '../../src/lib/api'
import { getToken } from '../../src/lib/auth'

export default function Product(){
  const router = useRouter()
  const { id } = router.query
  const [product,setProduct] = useState<any>(null)
  const [history,setHistory] = useState<any[]>([])
  const [status,setStatus]=useState('')
  const [holderName,setHolderName]=useState('')
  const [holderRoll,setHolderRoll]=useState('')

  useEffect(()=>{
    if(!id) return
    get(`/api/v1/products/${id}`).then((res:any)=>{ setProduct(res.product); setHistory(res.history) }).catch(()=>{})
  },[id])

  async function submit(e:any){
    e.preventDefault()
    const token = getToken()
    const payload:any = { status }
    if(status==='WITH_PERSON') payload.holder = { name: holderName, roll: holderRoll }
    try{
      await patch(`/api/v1/products/${id}/status`, payload, token || undefined)
      // reload
      const res:any = await get(`/api/v1/products/${id}`)
      setProduct(res.product); setHistory(res.history)
      alert('Status updated')
    }catch(err:any){ alert('Error: '+err.message) }
  }

  if(!product) return <div className="card">Loading...</div>

  return (
    <div>
      <h2>{product.name}</h2>
      <div className="card">
        <div><strong>Sport:</strong> {product.sport?.name}</div>
        <div><strong>Status:</strong> {product.status}</div>
        <div><strong>Holder:</strong> {product.currentHolder?.name || '-'}</div>
      </div>

      <div className="card">
        <h3>Change Status</h3>
        <form onSubmit={submit}>
          <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">Select status</option>
            <option value="INVENTORY">INVENTORY</option>
            <option value="SPORTS_COMPLEX">SPORTS_COMPLEX</option>
            <option value="WITH_PERSON">WITH_PERSON</option>
            <option value="DELETED">DELETED</option>
          </select>
          <div style={{height:8}} />
          {status==='WITH_PERSON' && (
            <div>
              <input className="input" placeholder="Holder name" value={holderName} onChange={e=>setHolderName(e.target.value)} />
              <div style={{height:8}} />
              <input className="input" placeholder="Holder roll" value={holderRoll} onChange={e=>setHolderRoll(e.target.value)} />
            </div>
          )}
          <div style={{height:8}} />
          <button className="btn" type="submit">Save</button>
        </form>
      </div>

      <div className="card">
        <h3>History</h3>
        <table className="table">
          <thead><tr><th>When</th><th>Action</th><th>By</th><th>Holder</th><th>Notes</th></tr></thead>
          <tbody>
            {history.map(h=> (
              <tr key={h.id}><td className="small">{new Date(h.createdAt).toLocaleString()}</td><td>{h.action}</td><td>{h.byUser?.email}</td><td>{h.holder?.name}</td><td className="small">{h.notes}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
