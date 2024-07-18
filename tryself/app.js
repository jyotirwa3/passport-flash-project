// app.js
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/User');
const { ensureAuthenticated } = require('./middleware/auth');
const app = express();

// MongoDB connection
// mongoose.connect('mongodb://localhost:27017/passportjs', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
// });
mongoose.connect('mongodb://localhost:27017/passportjs')
.then(()=>{
    console.log("db connected")
})
.catch(()=>{
    console.log("db not connected")
});


// Body parser middleware
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Passport config
require('./config/passport')(passport);

// Routes
app.get('/', (req, res) => {
    res.send('Home Page');
});

app.get('/login', (req, res) => {
    res.send('Login Page');
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true,
    })(req, res, next);
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.send('Dashboard Page');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
