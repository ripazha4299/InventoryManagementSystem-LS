import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import authRoutes from './routes/auth'
import productsRoutes from './routes/products'
import sportsRoutes from './routes/sports'
import keysRoutes from './routes/keys'
import adminRoutes from './routes/admin'
import exportRoutes from './routes/export'

import { errorHandler } from './middleware/errorHandler'

const app = express()

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productsRoutes)
app.use('/api/v1/sports', sportsRoutes)
app.use('/api/v1/keys', keysRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/export', exportRoutes)

app.use(errorHandler)

export default app
