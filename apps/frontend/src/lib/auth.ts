export function setToken(token: string) { localStorage.setItem('ims_token', token) }
export function getToken(): string | null { return typeof window !== 'undefined' ? localStorage.getItem('ims_token') : null }
export function clearToken(){ if (typeof window !== 'undefined') localStorage.removeItem('ims_token') }
export function getUser(){ const u = typeof window !== 'undefined' ? localStorage.getItem('ims_user') : null; return u? JSON.parse(u): null }
export function setUser(u:any){ if(typeof window!=='undefined') localStorage.setItem('ims_user', JSON.stringify(u)) }
