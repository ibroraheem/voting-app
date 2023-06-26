const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'Access-Control-Allow-Origin'],
    }
));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/user', require('./routes/user'))
app.use('/admin', require('./routes/admin'))

connectDB();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

