// src/app.ts
require('dotenv').config();
import express, { Application} from 'express';
import mongoose, { ConnectOptions } from 'mongoose';
import bodyParser from 'body-parser'; 
import cors from 'cors'; //npm install --save @types/cors
import userRoutes from './routers/user_routes'; 
import blogRoutes from './routers/blog_routes'; 
import messageRoutes from './routers/msg_routes'; 
import commentsRoutes from './routers/comments_routes';
// import swaggerDocs from "./docs/swagger"
import session from 'express-session';
import cookieParser from 'cookie-parser';


const app = express();
 app.use(express.json());

 app.use(cors({
   credentials:true,
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true
}));
 


 const MONGO_URL ="mongodb+srv://elyse123:elyse123@cluster0.opfpung.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
 mongoose.connect(MONGO_URL,{
    dbName: "Cluster0",
 })
 .then(() => {
    console.log("database connected");
 })
 .catch((error)=> console.log(error));
 app.use('/', userRoutes); 
app.use('/', blogRoutes); 
app.use('/', messageRoutes); 
app.use('/', commentsRoutes); 

 app.listen(5646, () =>{
console.log('server running on http://localhost:5646');
// swaggerDocs(app, 5546);
// swagger
const { swaggerUi, swaggerDocs } = require('./docs/swagger');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
 });


 
// const app: Application = express();
// const PORT: number = 5678;
// // const MONGODB_URI: string = "mongodb://localhost:27017/TSPortifo";
// const MONGODB_URI: string = process.env.MONGO_CONNECT_STRING!;
// import MongoStore from 'connect-mongo';



// Middleware
const corsOptions = {
  origin: ['http://localhost:5646'],
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());



// // sessions and cookies

// app.use(cookieParser());
// app.use(session({
//   secret: process.env.SESSION_KEY!,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false },
//   store:MongoStore.create({mongoUrl:MONGODB_URI})

//   }));







 
// // Connect to MongoDB
// mongoose.connect(MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true} as ConnectOptions)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     // Start the server once connected to the database
//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });

// // Routes
// app.use('/', userRoutes); // Using userRoutes for '/users' route
// app.use('/', blogRoutes); // Using blogRoutes for '/blogs' route
// app.use('/', messageRoutes); // Using messageRoutes for '/messages' route
// app.use('/', commentsRoutes); // Using commentsRoutes for '/comments' route


export default app;



