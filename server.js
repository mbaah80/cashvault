let express = require('express');
let morgan = require('morgan');
let logger = require('./logger');
let db = require('mongoose');
let ecobank = require('./apis/unifiedApi');
let config = require('./config/keys');
let app = express();

db.connect(config.db, (err, client)=>{
 if (err) {
  logger.error(err);
 }else{
  logger.info('connected to database');
 }
} )

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//routes
const tokenRoute = require('./routes/token');
const accountRoute = require('./routes/account');


app.use('/api', tokenRoute);
app.use('/api', accountRoute);


app.get('/', (req, res)=>{
    res.send('welcome to ecobank api');
})


const port = process.env.PORT || 3000;



app.listen(port, () => logger.info(`server is  listening on port ${port}!`));