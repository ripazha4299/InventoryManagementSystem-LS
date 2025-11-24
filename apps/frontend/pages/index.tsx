import { useEffect, useState } from 'react'
import Link from 'next/link'
import { get } from '../src/lib/api'
import { getToken, getUser } from '../src/lib/auth'
import { downloadSnapshot } from '../src/lib/api'

export default function Home(){
  const [view,setView] = useState<'by_sport'|'alphabetical'>('by_sport')
  const [q,setQ] = useState('')
  const [products,setProducts] = useState<any[]>([])
  const [total,setTotal] = useState(0)

  async function load(){
    const res:any = await get(`/api/v1/products?view=${view}&q=${encodeURIComponent(q)}`)
    setProducts(res.items || [])
    setTotal(res.total || 0)
  }

  useEffect(()=>{ load() },[view,q])

  function onDownload(){
    const token = getToken()
    downloadSnapshot(token).then(blob=>{
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'inventory_snapshot.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
    }).catch(e=>alert('Export failed: '+e.message))
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
        <div>
          <button className="btn" onClick={()=>setView('by_sport')}>By Sport</button>
          <button style={{marginLeft:8}} className="btn" onClick={()=>setView('alphabetical')}>Alphabetical</button>
        </div>
        <div>
          <input className="input" placeholder="search" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn" style={{marginLeft:8}} onClick={onDownload}>Download Snapshot</button>
        </div>
      </div>

      <div className="card">
        <h3>Products ({total})</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Sport</th><th>Status</th><th>Last Used</th></tr></thead>
          <tbody>
            {products.map(p=> (
              <tr key={p.id}>
                <td><Link href={`/product/${p.id}`}>{p.name}</Link></td>
                <td>{p.sport?.name}</td>
                <td>{p.status}</td>
                <td className="small">{p.lastUsedBy?.name || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
