// import express in server js
import express from "express"

// create a server instance
const app = express();

// set costant to port
const port = process.env.PORT || 3000;

//add root route
app.get("/", (req, res) => {
    res.send("Home Page");
});