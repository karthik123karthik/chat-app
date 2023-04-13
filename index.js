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


// database related ---------
const connectttodatabase = async () => {
  try {
    const db = await mongoose.connect("mongodb://0.0.0.0:27017/chat-app");
    //await Conversation.deleteMany({});
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
      res.cookie = {username:username};
      res.redirect(`/${username}/chat`);
    } 
    else res.render("login",{error:"incorrect password"});
  }
  else {
    res.render("login",{error:"User not found"});
  }
});

app.get("/:username/chat", async (req, res) => {
  const arr = await Conversation.find({});
  let {username} = req.params;
  res.render("index", { conversations: arr, user:username});
});


/////// socket.io connection
io.on("connection", async (socket) => {
  try {
    let userid = socket.handshake.query.username;
    let newmessage = new Conversation({
      type: "notification",
      user: `${userid}`,
      message: `${userid} joined`,
    });
    await newmessage.save();
    io.emit("new user", userid);
    socket.on("disconnect", async () => {
      let newmessage = new Conversation({
        type: "notification",
        user: `${userid}`,
        message: `${userid} left`,
      });
      await newmessage.save();
      io.emit("disconnected", userid);
    });

    socket.on("chat message", async (msg) => {
      let newmessage = new Conversation({
        type: "message",
        user: `${userid}`,
        message: msg,
      });
      await newmessage.save();
      socket.broadcast.emit("chat message", {sender:userid, msg:msg});
    });
  } catch (err) {
    console.log(err);
  }
});
///////////////////////////////////////////////////////

server.listen(3000, () => {
  console.log("listening on port 3000");
});
