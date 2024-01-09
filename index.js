import express  from "express";
import http  from "http";
import {Server} from "socket.io";
import path, { join }  from "path";
import { fileURLToPath } from "url";

const app = express();
const server = http.createServer(app);
const io = new Server(server);


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

app.use(express.static(join(__dirname,'public')));


app.get('/',(req,res) => {
    res.sendFile(__dirname,'/index.html');
});

const users = {};

io.on('connection',socket => {
    socket.on('new-user-joined',(name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('send', (msg) => {
        socket.broadcast.emit('receive',{message:msg,name:users[socket.id]});
    });

    socket.on('disconnect',(msg) => {
        socket.broadcast.emit('leave',users[socket.id]);
        delete users[socket.id];
    });
    
})



server.listen(3000,() => {
    console.log('Server running at http://localhost:3000');
});
