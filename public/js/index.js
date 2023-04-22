////////////////////////////////////
let path = location.pathname.split('/');
let username = path[1].split("%20").join(" ");
let room = path[2].split("%20").join(" ");

const profile = {
  "Python":"python.png",
  "Javascript":"javascript.png",
  "C++" : "c++.png",
  "C":"c.jpg"
}

//////////////////////////////////
var socket = io.connect("https://chat-app-10h9.onrender.com/",{
  query:{
    username: username,
    room : room
  }
});

/*var socket = io.connect("http://localhost:3000/",{
  query:{
    username: username,
    room : room
  }
});*/


//////////////////////
socket.on('connect',()=>{
  console.log("connected")
})
////////////////////

const form = document.getElementsByClassName("bottom-bar")[0];
const input = document.getElementById("input-bar");
const messagebox = document.getElementsByClassName("message-box")[0];
const selectBox = document.getElementsByClassName("private-messaging")[0];
const header = document.getElementsByClassName("title")[0];
const proPhoto = document.getElementsByClassName("profile-image")[0];

if(room!=="chat"){
  header.innerText = `${room} Programming`;
  proPhoto.src=`/${profile[room]}`;
}
else {
  header.innerText = `programming group`;
  proPhoto.src=`/profile.jpg`;
}

form.addEventListener('submit',(e)=>{
    e.preventDefault()
    if(input.value){
        socket.emit('chat message',input.value);
        let div = document.createElement('div');
        div.innerHTML= `<h4 class="messager">~${username}</h4><p>${input.value}</p><span style="text-align:right; padding:2px; font-size:11px; font-weight:400; line-height:15px; color:#667781;font-family:'Segoe UI','Helvetica Neue', Tahoma, Geneva, Verdana, sans-serif;">today</span>`;
        div.className = "my-message";
        messagebox.appendChild(div);
        window.scrollTo(0, document.body.scrollHeight);
        input.value = '';
    }
});

selectBox.addEventListener('change',()=>{
   location.href = `/${username}/${selectBox.value}`
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
    div.innerHTML= `<h4 class="messager">~${chat.sender}</h4><p>${chat.msg}</p><span style="text-align:right; padding:2px; font-size:11px; font-weight:400; line-height:15px; color:#667781; font-family:'Segoe UI','Helvetica Neue', Tahoma, Geneva, Verdana, sans-serif;">${chat.time}</span>`;
    div.className = "message";
    messagebox.appendChild(div);
    window.scrollTo(0, document.body.scrollHeight);
})
///////////////////////////