const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

let onlineUsers = 0

// Listen for device connections
io.on('connection', (socket) => {
  console.log(`Device connected: ${socket.id}`)

  onlineUsers++

  // Notify all clients of the new online count
  io.emit("online_count", onlineUsers)

  // Notify all clients when a device connects
  io.emit('device_connected', { id: socket.id })

  // Listen for messages from the connected device
  socket.on('message', (data) => {
    console.log(`Message received from ${socket.id}: ${data}`)

    // Broadcast the received message to all clients
    io.emit('broadcast_message', { id: socket.id, message: data })
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    onlineUsers--

    // Notify all clients of the new online count
    io.emit("online_count", onlineUsers)

    console.log(`Device disconnected: ${socket.id}`)
    io.emit('device_disconnected', { id: socket.id })
  })



})

// Start the server
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
