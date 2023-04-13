
let path = location.pathname.split('/');
let username = path[1].split("%20").join(" ");
let room = path[2].split("%20").join(" ");

var socket = io.connect("http://localhost:3000",{
  query:{
    username: username,
    room : room
  }
});
//////////////////////
socket.on('connect',()=>{
  console.log("connected")
})
////////////////////

const form = document.getElementsByClassName("bottom-bar")[0];
const input = document.getElementById("input-bar");
const messagebox = document.getElementsByClassName("message-box")[0];

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(input.value){
        socket.emit('chat message',input.value);
        let div = document.createElement('div');
        div.innerHTML= `<h4 class="messager">~${username}</h4><p>${input.value}</p>`;
        div.className = "my-message";
        messagebox.appendChild(div);
        window.scrollTo(0, document.body.scrollHeight);
        input.value = '';
    }
})
////////////////////
socket.on("disconnected",(id)=>{
    let div = document.createElement('div');
    div.innerHTML= `<p>${id} left</p>`;
    div.className = "notification-message";
    messagebox.appendChild(div);
    window.scrollTo(0, document.body.scrollHeight);
})
///////////////////////

socket.on("new user",(id)=>{
    let div = document.createElement('div');
    div.innerHTML= `<p>${id} joined</p>`;
    div.className = "notification-message";
    messagebox.appendChild(div);
    window.scrollTo(0, document.body.scrollHeight);
})
////////////////////////////////
socket.on('chat message',(chat)=>{
    let div = document.createElement('div');
    div.innerHTML= `<h4 class="messager">~${chat.sender}</h4><p>${chat.msg}</p>`;
    div.className = "message";
    messagebox.appendChild(div);
    window.scrollTo(0, document.body.scrollHeight);
})
///////////////////////////