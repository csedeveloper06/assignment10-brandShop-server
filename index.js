const express = require("express");
const cors = require('cors');
const res = require("express/lib/response");
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


app.get('/', (req,res) => {
    res.send('techHub is running on server');
})

app.listen(port, () => {
    console.log(`techHub server is running on port : ${port}`);
})