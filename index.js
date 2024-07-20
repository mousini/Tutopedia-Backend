
    const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Database', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/sign_up", (req, res) => {
    const { name, email, password } = req.body;

    const data = { name, email, password };

    db.collection('tutopedia2').insertOne(data, (err) => {
        if (err) {
            console.log("Error inserting record", err);
            res.status(500).send("Server Error");
        } else {
            console.log("Record Inserted Successfully");
            res.redirect('/signup_successful.html');
        }
    });
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
