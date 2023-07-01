const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const connectDB = require('./config/db');
bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Headers', 'Access-Control-Request-Headers', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Headers',  'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-low-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
    }
));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/user', require('./routes/user'))
app.use('/admin', require('./routes/admin'))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

connectDB();
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});