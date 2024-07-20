var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/Database', { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

app.post("/sign_up", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "password": password
    };

    db.collection('tutopedia2').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('signup_successful.html');
});

app.post("/sign_in", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    db.collection('tutopedia2').findOne({ email: email }, (err, user) => {
        if (err) {
            res.status(500).send('Error occurred while signing in');
        } else if (!user) {
            res.status(400).send('User not found');
        } else if (user.password !== password) {
            res.status(400).send('Invalid password');
        } else {
            res.send('Sign-in successful');
        }
    });
});

app.get("/", (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('index.html');
}).listen(3000);

console.log("Listening on port 3000");
