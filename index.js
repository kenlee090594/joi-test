const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const dbConnect = require('./config/dbConn');

const userRoutes = require('./routes/userRoute');

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );


app.use('/api/users', userRoutes);
  
const PORT = process.env.PORT || 5000;

dbConnect();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


