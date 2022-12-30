const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();



const doctorRoutes = require('./api/routes/doctors');
const hospitalRoutes = require('./api/routes/hospitals');

mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PASSWORD + '@node-shop.wpytcfi.mongodb.net/?retryWrites=true&w=majority');

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
    });

app.use('/doctors', doctorRoutes);
app.use('/hospitals', hospitalRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);

});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            Message:'error.message'
        }
    });
  
  });

module.exports = app;