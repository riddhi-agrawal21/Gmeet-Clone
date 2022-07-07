const socket = io('http://localhost:3000');

const myPeer = new Peer(undefined , {
     host: '/',
     port: '3001'
 })

myPeer.on('open' , id =>{
    socket.emit('join-room', ROOM_ID , id)
}) 
const peers ={}
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then( stream =>{
    addVideoStream( myVideo , stream)
    
    myPeer.on('call', call =>{
        call.answer(stream)
        const video = document.createElement('video');
        call.on('stream' , userVideoStream=>{
            addVideoStream( video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        //connectToNewUser(userId , stream)
        setTimeout(connectToNewUser , 1000 , userId, stream)
    })
})

// socket.on('user-disconnected', userId =>{
//    if(peers[userId])  peers[userId].close();
// } )



function connectToNewUser( userId , stream){
    const call = myPeer.call( userId , stream);
    const video = document.createElement('video')
    call.on('stream' , userVideoStream =>{
        addVideoStream(video , userVideoStream)
    })
    call.on('close' , () =>{
        video.remove();
    })

    peers[userId] = call
}

function addVideoStream(video , stream){
    video.srcObject = stream
    video.addEventListener('loadedmetadata' , () =>{
        video.play()
    })
    videoGrid.append(video)
}

const main_chat_window = document.getElementsByClassName('main_chat_window')

socket.on('chat-message' , message=>{
    console.log(message)
})
//const message = messageInput.value 

var text = document.getElementById('chat-message');
console.log(text.value);

document.querySelector('html').addEventListener('keydown',  (e) =>{
    if(e.which == 13 && text.value.length !== 0){
        let li = document.createElement('li');
        li.innerHTML =`<li class="user">
                        <b>You:</b>${text.value}
                        </li>`
        document.querySelector('ul').append(li);
        console.log(text.value);                
        socket.emit('send-chat-message', text.value);
        text.value = '';
        main_chat_window.scrollTop = main_chat_window.scrollHeight;
    }
} )

socket.on('createMessage' , (message) =>{
    console.log(message);
    let li = document.createElement('li');
    li.innerHTML =`<li class="user">
    <b>User:</b>${text.value}
    </li>`
    document.querySelector('ul').append(li);
    main_chat_window.scrollTop = main_chat_window.scrollHeight;
})
//<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
//<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous"></link>
//messageForm.addEventListener('submit', e => {
    //     e.preventDefault()
    //     const message = messageInput.value
    //     //appendMessage(`You: ${message}`)
    //     socket.emit('send-chat-message', message)
    //     messageInput.value = ''
    //   })
    
    // function appendMessage(message) {
    //     const messageElement = document.createElement('div')
    //     messageElement.innerText = message
    //     messageContainer.append(messageElement)
    // }
    
    
    
    
    
    
    
    
    
    
    // const $ = document.querySelector
    // var text = $('input');