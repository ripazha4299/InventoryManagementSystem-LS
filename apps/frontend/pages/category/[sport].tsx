import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { get } from '../../src/lib/api'

export default function Category(){
  const router = useRouter()
  const { sport } = router.query
  const [items,setItems]=useState<any[]>([])

  useEffect(()=>{
    if(!sport) return
    get(`/api/v1/products?sport_id=${sport}`).then((res:any)=> setItems(res.items || [])).catch(()=>{})
  },[sport])

  return (
    <div>
      <h2>Category: {sport}</h2>
      <div className="card">
        <table className="table">
          <thead><tr><th>Name</th><th>Status</th></tr></thead>
          <tbody>
            {items.map(i=> (
              <tr key={i.id}><td>{i.name}</td><td>{i.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
