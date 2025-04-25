const path = require('path')
require ('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override')
 
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session')

const connectDB = require('./server/config/db')
const { isActiveRoute } = require('./server/helpers/routerHelpers')


const app = express();
const PORT = 10000 || process.env.PORT;


//connect to database
connectDB();

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride ('_method'))

app.use(session({
   secret: 'keyboad cat',
   resave: false,
   saveUninitialized: true,
   store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    
   })
   //cookie: { maxAge: new Date( Date.now() + (3600000))}

}))

app.use(express.static('public'))


// templating engine
app.use(expressLayout);
app.set('layout', './layouts/main')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('layout', path.join(__dirname, 'views', 'Layouts', 'admin'))

app.get("/admin", (req, res)=>{
    res.render("admin/index",{ layout: path.join(__dirname, 'views', 'Layouts', 'admin')} )
})

app.locals.isActiveRoute = isActiveRoute

app.use('/', require('./server/routes/main'))
app.use('/', require('./server/routes/admin'))

console.log("Views Path:", path.join(__dirname, "views"))

app.listen(PORT, ()=> {
    console.log(`App listening on port= ${PORT}`);
});