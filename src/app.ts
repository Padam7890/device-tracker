import express from 'express'
import cors from 'cors'
import {errorMiddleware} from './middlewares/error.js'
import morgan from 'morgan'
import dotenv from 'dotenv'
import loadRoutes from './routes/mainRoute.js'
import http from 'http'
import {Server} from 'socket.io'
import path from 'path'

dotenv.config({path: './.env',});
  export const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
  const port = process.env.PORT || 3000;


 const app = express();
 app.set('view engine', 'ejs');



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin:' * ',credentials:true}));
app.use(morgan('dev'))

app.use(express.static(path.join(__dirname, 'public')));

// app.use('/public', express.static('public'));


console.log("file" +__dirname, "public")
loadRoutes(app)

app.use(errorMiddleware);

const server = http.createServer(app);

const io = new Server(server);


io.on('connection', (socket) => {
 console.log("connection established")
 socket.on("send location", (data) =>{
  io.emit("receive-location",{id:socket.id, ...data})
 })
 socket.on("disconnect", () => {
  console.log("user disconnected")
 })
});


  
server.listen(port, () => console.log('Server is working on Port:'+port+' in '+envMode+' Mode.'));