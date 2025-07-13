import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './db/dbConnection.js';
import messageRoutes from './routes/message.routes.js'
import {app, server} from './utils/socket.js';

dotenv.config();
const PORT = process.env.PORT

app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended: true, limit:'10mb'}))
app.use(cookieParser());

app.use(cors({
    origin:`${process.env.CLIENT_URL}`,
    credentials:true
}))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/messages', messageRoutes)

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
    connectDB()
})