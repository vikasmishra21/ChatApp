const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

let {generateMessage, generateLocationMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '/../public')
const port = process.env.PORT || 3000
let app = express()
let server = http.createServer(app)
let io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('A new user just  connected.')

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Chat App.'))
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User joined.'))

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message)
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback('This is a server.')
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage("Admin", coords.lat, coords.lng))
    })

    socket.on('disconnect', () => {
        console.log('user was disconnected')
    })
})

server.listen(port, () => {
    console.log('connected')
})