const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js']; // Specify the file(s) that contain your API routes

swaggerAutogen(outputFile, endpointsFiles);
