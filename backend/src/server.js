import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './db/dbConnection.js';
import messageRoutes from './routes/message.routes.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({extended: true, limit:'10mb'}))
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/message', messageRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
    connectDB()
})