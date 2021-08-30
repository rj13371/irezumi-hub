require('dotenv').config();

const ExpressError = require('./utils/ExpressErrors')
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')
const path = require('path')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const passport = require('passport')
const localStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo')
const mongoDBURL = process.env.MONGODB_URI


app.use(helmet());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://source.unsplash.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];



const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data: https://res.cloudinary.com/dwxcp0a8j/image/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://source.unsplash.com/",
                "https://unsplash.com/photos/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const usersRoute = require('./routes/user')
const tattooShopsRoute = require('./routes/tattooShops')
const reviewsRoute = require('./routes/reviews');
const appointmentsRoute = require('./routes/appointments');

const secret = process.env.SECRET || "squirrel"

const store = MongoStore.create({
    mongoUrl: mongoDBURL,
    touchAfter: 24 * 60 * 60,
        secret: secret
});

store.on("error",  (e)=>{
    console.log (e)
})


const sessionOptions = {
    store,
    name:'session',
    secret: secret, 
    resave: false,
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}




app.use(flash());
app.use(session (sessionOptions))
app.use(passport.initialize())
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



mongoose.connect(mongoDBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify:false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('connection open')
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());





app.use((req,res,next)=>{

    res.locals.user = req.user;
    res.locals.messages = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// ROUTES

app.use ('/', usersRoute);
app.use ('/tattooShops', tattooShopsRoute);
app.use ('/tattooShops/:id/appointments', appointmentsRoute);
app.use ('/tattooShops/:id/reviews', reviewsRoute);


app.get('/', (req, res)=>{
    res.render('home')
})



app.all('*', (req,res, next )=>{
    next(new ExpressError('Page not found!', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No! Something Went Wrong!';
    res.status(statusCode).render('tattooShops/error', {err});
})

app.listen(process.env.PORT || 3000);