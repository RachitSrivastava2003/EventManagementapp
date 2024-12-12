const express = require('express');
const mysql = require('mysql2');
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');
const { error, log } = require('console');

let app = express();

app.set("view engine","ejs");

app.set("views",path.join(__dirname,"/views"));

app.use(methodOverride("_method"));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.join(__dirname,"/public")));

const port = 8080;

app.listen(port,()=>{
    console.log("Listening Port Number 8080.....");
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Rachit@30',
    database: 'eventm'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});
// ================================================================================
app.get('/home',(req,res)=>{
    res.render('home.ejs');
})
// ==============================================================================
app.get("/adminlogin",(req,res)=>{
    res.render("adminLogin.ejs");
});

app.post('/adminlogin', (req, res) => {
    const { userid, password } = req.body;

    if (!userid || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both User ID and Password' });
    }

    const query = 'SELECT * FROM user WHERE gmail = ? AND password = ? AND status = "admin"';
    db.query(query, [userid, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials or unauthorized access' });
        }
    });
});
// ======================================================================
app.get("/userlogin",(req,res)=>{
    res.render("userLogin.ejs");
});

app.post('/userlogin', (req, res) => {
    const { userid, password } = req.body;

    if (!userid || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both User ID and Password' });
    }

    const query = 'SELECT * FROM user WHERE gmail = ? AND password = ? AND status = "user"';
    db.query(query, [userid, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials or unauthorized access' });
        }
    });
});
// ===================================================================================
app.get("/venderlogin",(req,res)=>{
    res.render("venderLogin.ejs");
});

app.post('/venderlogin', (req, res) => {
    const { userid, password } = req.body;
    console.log(userid,password)
    if (!userid || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both User ID and Password' });
    }

    const query = 'SELECT * FROM user WHERE gmail = ? AND password = ? AND status = "vendor"';
    db.query(query, [userid, password], (err, results) => {
        if (err) {
            console.error('Error executing query:', err.message);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials or unauthorized access' });
        }
    });
});
// ====================================================================
app.get('/adminsignup',(req,res)=>{
    res.render("adminSignup.ejs");
})

app.post('/adminsignup', (req, res) => {
    const { name, gmail, password } = req.body;

    // Validate form fields
    if (!name || !gmail || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    // Check if there is already an admin in the database
    const checkAdminQuery = 'SELECT COUNT(*) AS adminCount FROM user WHERE status = "admin"';
    db.query(checkAdminQuery, (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error. Please try again later.' });
        }

        // If an admin already exists
        if (results[0].adminCount > 0) {
            return res.json({ success: false, message: 'Only one admin can be created.' });
        }

        // Insert the new admin into the database
        const insertQuery = 'INSERT INTO user (name, gmail, password, status) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [name, gmail, password, 'admin'], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }

            // Successfully created the admin
            res.json({ success: true, message: 'Admin created successfully!' });
        });
    });
});
// ===============================================================
app.get('/usersignup',(req,res)=>{
    res.render("userSignup.ejs");
})

app.post('/usersignup', (req, res) => {
    const { name, gmail, password } = req.body;

    // Validation: Ensure all fields are provided
    if (!name || !gmail || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    // Query to check if the user with the same gmail already exists
    const checkUserQuery = 'SELECT * FROM user WHERE gmail = ?';
    db.query(checkUserQuery, [gmail], (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error. Please try again later.' });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'User with this email already exists.' });
        }

        // Query to insert new user into the database
        const insertQuery = 'INSERT INTO user ( gmail, password,username, status) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [gmail, password,name, 'user'], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }

            // Successfully created user
            res.json({ success: true, message: 'User created successfully!' });
        });
    });
});
// ==============================================================
app.get("/vendersignup",(req,res)=>{
    res.render("venderSignup");
})
app.post('/vendersignup', (req, res) => {
    const { name, gmail, password, category } = req.body;

    // Validation: Ensure all fields are provided
    if (!name || !gmail || !password || !category) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    // Query to check if a user or vendor with the same email already exists
    const checkEmailQuery = 'SELECT * FROM user WHERE gmail = ?';
    db.query(checkEmailQuery, [gmail], (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error. Please try again later.' });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'Email already registered.' });
        }

        // Query to insert new vendor into the database
        const insertVendorQuery = 'INSERT INTO user (username, gmail, password, category, status) VALUES (?, ?, ?, ?, ?)';
        db.query(insertVendorQuery, [name, gmail, password, category, 'vendor'], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }

            // Successfully created vendor
            res.json({ success: true, message: 'Vendor created successfully!' });
        });
    });
});
