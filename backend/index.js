import express from 'express'
import mongoose from 'mongoose';
import userRouter from './routes/user.routes.js'
import authRoute from './routes/user.auth.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

mongoose.connect("mongodb+srv://koukisaif:root@cluster0.8yc94wm.mongodb.net/SATALANA?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(8000, () => {
    console.log('Server running on port 8000');
})

app.use('/api/user', userRouter)
app.use('/api/auth', authRoute)

app.use((err, req, res, next) => { // middleware for error handling
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode: statusCode
    })
})


// pratikgauth