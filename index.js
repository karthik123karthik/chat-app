const express = require("express");
const app = express();
const ejs = require("ejs");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require("mongoose");
const { User, Conversation } = require("./Model/index");
const bodyparser = require("body-parser");
const moment = require('moment');

let PORT = process.env.PORT || 3000;

// database related ---------
const connectttodatabase = async () => {
  try {
    const db = await mongoose.connect("mongodb+srv://karthikgk:karthik123@cluster0.nxuwhxd.mongodb.net/?retryWrites=true&w=majority");
    console.log("connected");
  } catch (err) {
    console.log(err);
  }
}; -
connectttodatabase();
/////////////////////////////////////////

// serving static filezs
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: false }));
/////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.render("login",{error:"if you dont have username please signup...."});
});

app.get("/signup", (req, res) => {
  res.render("signup",{error:"if you already have username login....."});
});

app.post("/signup", async(req, res)=>{
  try{
     const {username, password} = req.body;
     let user = new User({name:username,password:password});
     await user.save();
     res.redirect(`/${username}/chat`)
  }catch(err){
      res.render("signup",{error:"username already exists"})
  }
})

app.post("/", async(req, res) => {
  const {username, password} = req.body;
  let user = await User.find({name:username});
  if(user.length>0){
    if(user[0].password === password) {
      res.redirect(`/${username}/chat`);
    } 
    else res.render("login",{error:"incorrect password"});
  }
  else {
    res.render("login",{error:"User not found"});
  }
});

app.get("/:username/:chat", async (req, res) => {
  let {username, chat} = req.params;
  const arr = await Conversation.find({room:chat});
  res.render("index", { conversations: arr, user:username});
});


/////// socket.io connection
io.on("connection", async (socket) => {
  try {
    let userid = socket.handshake.query.username;
    let room = socket.handshake.query.room; 
    socket.join(room);
    io.to(room).emit("new user", userid);
    socket.on("disconnect", async () => {
      io.to(room).emit("disconnected", userid);
    });

    socket.on("chat message", async (msg) => {
      let now  = moment().format('MMMM Do YY');
      let newmessage = new Conversation({
        type: "message",
        user: `${userid}`,
        message: msg,
        time:now,
        room:room
      });
      await newmessage.save();
      socket.to(room).emit("chat message", {sender:userid, msg:msg, time:now});
    });
  } catch (err) {
    console.log(err);
  }
});
///////////////////////////////////////////////////////

server.listen(PORT, () => {
  console.log("listening on port 3000");
});