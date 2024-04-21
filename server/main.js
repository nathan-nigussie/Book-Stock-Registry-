//imports
const connectDB=require('./db/connection.js');
require('dotenv').config();
const express=require('express');
const app=express();

const session=require('express-session');


const port=process.env.PORT||3000

const start=async () => {
    try {
        await connectDB(process.env.MONGO_URI)

        app.listen(port,console.log(`Server is listening on port ${port}...`))
    } catch(error) {
        console.log(error)
    }
}

start();

//middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
}));

app.use((req,res,next) => {
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})

app.use(express.static('uploads'));

app.set('view engine','ejs');

//route prefix
app.use("",require("./routes/routes.js"));




