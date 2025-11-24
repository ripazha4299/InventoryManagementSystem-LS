const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

async function request(path: string, options: RequestInit = {}) {
  const url = `${API}${path}`
  const res = await fetch(url, options)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || body.message || `HTTP ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res
}

export async function get(path: string) { return request(path) }

export async function post(path: string, body: any, token?: string) {
  return request(path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) })
}

export async function patch(path: string, body: any, token?: string) {
  return request(path, { method: 'PATCH', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) })
}

export async function del(path: string, token?: string) {
  return request(path, { method: 'DELETE', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
}

export function downloadSnapshot(token?: string) {
  const url = `${API}/api/v1/export/inventory?format=xlsx`
  // fetch as blob to include Authorization
  return fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} }).then(async r => {
    if (!r.ok) throw new Error('Export failed')
    return r.blob()
  })
}
