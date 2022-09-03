const express = require('express')
const connectDB = require('./config/db')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore =  require('connect-mongo')
const logger = require('morgan')
const dotenv = require('dotenv')
dotenv.config({path: './config/config.env'})
const mainRoutes = require('./routes/main')
const itemRoutes = require('./routes/items')
const flash = require('express-flash')
const app = express()

// passport config
require('./config/passport')(passport)


connectDB()

// static assets
app.use(express.static('public'))

// ejs 
app.set('view engine', 'ejs')

// encode the request information 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
    })
  )

//   passport middleware
app.use(passport.initialize())
app.use(passport.session())


// connect flash
app.use(flash())

// routes
app.use('/', mainRoutes)
app.use('/items', itemRoutes)





const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server is runnin on port: ${PORT}. You better go catch it.`))