let express = require('express');
let morgan = require('morgan');
let logger = require('./logger');
let db = require('mongoose');
let passport = require('passport');
let config = require('./config/keys');
let session = require('express-session');
let cors = require('cors');
let app = express();

db.connect(config.db, (err, client)=>{
 if (err) {
  logger.error(err);
 }else{
  logger.info('connected to database');
 }
} )

//middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());

//passport config
require('./auth/passport')(passport)

app.use(cors());



//routes
const tokenRoute = require('./routes/token');
const accountRoute = require('./routes/account');
const paymentRoute = require('./routes/payment');
const userRoute = require('./routes/user');
const mtnRoute = require('./routes/mtn');
const verifyRoute = require('./routes/verify');


app.use('/api', tokenRoute);
app.use('/api', accountRoute);
app.use('/api', paymentRoute);
app.use('/api', userRoute);
app.use('/api', mtnRoute);
app.use('/api', verifyRoute);


app.get('/', (req, res)=>{
    res.send('you are not authorized to view this page');
})


const port = process.env.PORT || 3000;



app.listen(port, () => logger.info(`server is  listening on port ${port}!`));