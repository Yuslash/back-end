import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import { MongoClient } from 'mongodb'

dotenv.config()

const app = express()
const port = 3000

app.use(bodyParser.json())

const uri = process.env.MONGO_URI
const dbName = 'anonymous'
let client, db, collection

async function connectDatabase() {
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 60000 })
  await client.connect()
  console.log('Database connected')
  db = client.db(dbName)
  collection = db.collection('login')
}

app.post('/login', async (req, res) => {
  if (!collection) {
    return res.status(500).json({ message: 'Database not connected yet' })
  }

  const { userId, password } = req.body

  if (!userId || !password) {
    return res.status(400).json({ message: 'userId and password are required' })
  }

  const user = await collection.findOne({ userId, password })

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  return res.status(200).json({ message: 'Login successful', userId: user.userId })
})

  ; (async () => {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  })()
