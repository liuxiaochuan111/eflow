import express from 'express'
import cors from 'cors'
import formRoutes from './routes/form'
import { initMockData } from './mock/data'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize mock data
initMockData()

// Routes
app.use('/api/forms', formRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'EFlow Backend is running' })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    code: 500,
    message: err.message || 'Internal Server Error',
    data: null
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: 'Not Found',
    data: null
  })
})

app.listen(PORT, () => {
  console.log(`🚀 EFlow Backend Server is running on port ${PORT}`)
  console.log(`📝 API Base URL: http://localhost:${PORT}/api`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
})
