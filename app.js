const { log } = require("console");
const express = require("express");
const cors = require("cors")
const path = require("path")
const app = express();

const PORT = process.env.PORT||5000;
const server = app.listen(PORT,()=>{console.log("server is running")})

let socketConnected = new Set();


const io = require('socket.io')(server)

app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))

io.on('connection',onConnected)

function onConnected(socket){
    console.log(socket.id);
    socketConnected.add(socket.id)

    io.emit('clients-total',socketConnected.size)

    socket.on('disconnect', () => {
        console.log("socket disconnected", socket.id);
        socketConnected.delete(socket.id);
        io.emit('clients-total', socketConnected.size);
    });

    socket.on('message',(data)=>{
        console.log(data)
        socket.broadcast.emit('chat-message',data)
    })

    socket.on('feedback',(data)=>{
        socket.broadcast.emit('feedback',data)
    })

    
}

