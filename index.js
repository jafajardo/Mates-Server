const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./router');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Mates');

const app = express();
app.use(bodyParser.json({ type: '*/*' }));
app.use(cors());
app.use(morgan('combined'));
router(app);

const port = process.env.port || 3091;
const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server listening at port ${port}`);
});