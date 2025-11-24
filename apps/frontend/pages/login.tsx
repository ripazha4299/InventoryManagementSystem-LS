import { useState } from 'react'
import { useRouter } from 'next/router'
import { post } from '../src/lib/api'
import { setToken, setUser } from '../src/lib/auth'

export default function Login(){
  const [email,setEmail] = useState('')
  const [err,setErr] = useState('')
  const router = useRouter()

  async function submit(e:any){
    e.preventDefault()
    try{
      const res:any = await post('/api/v1/auth/login', { email })
      setToken(res.token)
      setUser(res.user)
      router.push('/')
    }catch(err:any){ setErr(err.message) }
  }

  return (
    <div className="card">
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <div style={{height:12}} />
        <button className="btn" type="submit">Login</button>
      </form>
      {err && <div className="small" style={{color:'red'}}>{err}</div>}
    </div>
  )
}
