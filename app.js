const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const CookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); // Parsing any json requests to a JavaScript Object & Attaches the data to the request object.
app.use(CookieParser()); // For parsing cookie data from the browser.

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = '';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => {
    console.log('APP > Connected to MongoDB');
    app.listen(3000);
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser); // apply Middleware to every GET request
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

//cookies
// app.get('/set-cookies', (req, res) => {
//   //res.setHeader('Set-Cookie', 'newUser=true');

//   // COOKIE NOTES
//   // cookie option properties : maxAge/secure(set only if browser is using https)/httponly(can't access/modify cookies front-end)
//   // Remember to use authentication cookies on a secure https connection to avoid getting requests exposed on a public IP.
//   // Make sure certain cookies can't be modified front-end; like isEmployee: true
  
//   res.cookie('newUser', false);
//   res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 *24, httpOnly: true }); // Cookie Name | Value | Options Object
//   res.send('Your cookies have been saved');
// });

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies.newUser);
//   res.json(cookies);
// });


