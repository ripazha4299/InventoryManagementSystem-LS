import Link from 'next/link'
import { useRouter } from 'next/router'
import { getUser, clearToken } from '../lib/auth'

export default function Navbar(){
  const router = useRouter()
  const user = (typeof window !== 'undefined') ? getUser() : null
  function logout(){ clearToken(); router.push('/login') }
  return (
    <div className="nav">
      <div>
        <Link href="/"><strong>CollegeSportsInventory</strong></Link>
        <span style={{marginLeft:12}} className="small">Admin UI</span>
      </div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <Link href="/keys">Keys</Link>
        <Link href="/admin">Admin</Link>
        {user ? (
          <>
            <span className="small">{user.email}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link href="/login"><button className="btn">Login</button></Link>
        )}
      </div>
    </div>
  )
}
