const express =  require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
//setup server
//const $ = require("jquery");
app.set('view engine' , 'ejs');
app.use(express.static('public'));
app.get('/' , (req,res) =>{
    res.redirect(`/${uuidV4()}`);
});
app.get('/:room' ,(req,res) =>{
    res.render('room' , { roomId: req.params.room})
});

io.on('connection' , socket=> {
    console.log('new user')
    socket.on( 'join-room' , (roomId , userId) => {
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected',userId)
        // socket.on('send-chat-message', message =>{
        //     console.log(message)
        //     io.to(roomId).emit('chat-message' , message)
        // })
        // socket.on('disconnect', () =>{
        //     socket.broadcast.to(roomId).emit('user-disconnected', userId)
        // })
        socket.on('send-chat-message', (message) => {
            ///send message to same room
            console.log('here===' + message );
            setTimeout(() => {
                socket.to(roomId).emit('createMessage', message);
            }, 1000);
        })
    })
    
   
})

server.listen(3000)
