import request from 'supertest'
import app from '../src/app'
import dotenv from 'dotenv'

dotenv.config()

jest.setTimeout(30000)

describe('Products API integration', () => {
  let token: string | null = null

  it('logs in seeded admin and gets JWT', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'admin@college.edu' })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    token = res.body.token
  })

  it('GET /api/v1/products returns seeded items', async () => {
    const res = await request(app).get('/api/v1/products')
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(Array.isArray(res.body.items)).toBeTruthy()
    expect(res.body.total).toBeGreaterThanOrEqual(0)
  })

  it('PATCH /api/v1/products/:id/status updates product and creates history', async () => {
    // fetch products
    const list = await request(app).get('/api/v1/products')
    expect(list.status).toBe(200)
    const items = list.body.items
    if (!items || items.length === 0) return
    const id = items[0].id

    const payload = { status: 'WITH_PERSON', holder: { name: 'Test User', roll: 'TU001', contact: 'test@x.edu' }, notes: 'integration test issue' }
    const res = await request(app).patch(`/api/v1/products/${id}/status`).set('Authorization', `Bearer ${token}`).send(payload)
    expect(res.status).toBe(200)
    expect(res.body.product).toBeDefined()
    expect(res.body.product.status).toBe('WITH_PERSON')

    // fetch detail and check history
    const detail = await request(app).get(`/api/v1/products/${id}`)
    expect(detail.status).toBe(200)
    const history = detail.body.history
    expect(Array.isArray(history)).toBeTruthy()
    const found = history.find((h: any) => h.action === 'STATUS_UPDATE')
    expect(found).toBeDefined()
  })

  it('GET /api/v1/export/inventory returns xlsx attachment', async () => {
    const res = await request(app).get('/api/v1/export/inventory?format=xlsx')
    expect(res.status).toBe(200)
    expect(res.headers['content-disposition']).toMatch(/attachment; filename=inventory_snapshot.xlsx/)
  })
})
