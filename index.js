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
app.get('/',(req,res)=>{
    res.render('home.ejs');
})
app.get('/home',(req,res)=>{
    res.render('home.ejs');
})
// ==============================================================================
app.get("/adminlogin",(req,res)=>{
    res.render("admin/adminLogin.ejs");
});

app.post('/adminlogin', (req, res) => {
    const { userid, password } = req.body;
    // console.log(userid);

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
    res.render("user/userLogin.ejs");
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
    res.render("vendor/venderLogin.ejs");
});

app.post('/venderlogin', (req, res) => {
    const { userid, password } = req.body;
    // console.log(userid,password)
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
    res.render("admin/adminSignup.ejs");
})

app.post('/adminsignup', (req, res) => {
    const { name, gmail, password } = req.body;

    if (!name || !gmail || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    const checkAdminQuery = 'SELECT COUNT(*) AS adminCount FROM user WHERE status = "admin"';
    db.query(checkAdminQuery, (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error. Please try again later.' });
        }

        if (results[0].adminCount > 0) {
            return res.json({ success: false, message: 'Only one admin can be created.' });
        }

        const insertQuery = 'INSERT INTO user (name, gmail, password, status) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [name, gmail, password, 'admin'], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }
            res.json({ success: true, message: 'Admin created successfully!' });
        });
    });
});
// ===============================================================
app.get('/usersignup',(req,res)=>{
    res.render("user/userSignup.ejs");
})

app.post('/usersignup', (req, res) => {
    const { name, gmail, password } = req.body;

    if (!name || !gmail || !password) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    const checkUserQuery = 'SELECT * FROM user WHERE gmail = ?';
    db.query(checkUserQuery, [gmail], (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error. Please try again later.' });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'User with this email already exists.' });
        }

        const insertQuery = 'INSERT INTO user ( gmail, password,username, status) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [gmail, password,name, 'user'], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }

            res.json({ success: true, message: 'User created successfully!' });
        });
    });
});
// ==============================================================
app.get("/vendersignup",(req,res)=>{
    res.render("vendor/venderSignup");
})
app.post('/vendersignup', (req, res) => {
    const { name, gmail, password, category } = req.body;

    console.log(name,gmail);

    if (!name || !gmail || !password || !category) {
        return res.json({ success: false, message: 'All fields are required' });
    }

    const checkEmailQuery = 'SELECT * FROM user WHERE gmail = ?';
    db.query(checkEmailQuery, [gmail], (err, results) => {
        if (err) {
            return res.json({ success: false, message: 'Database error. Please try again later.' });
        }

        if (results.length > 0) {
            return res.json({ success: false, message: 'Email already registered.' });
        }

        const insertVendorQuery = 'INSERT INTO user (username, gmail, password, category, status) VALUES (?, ?, ?, ?, ?)';
        db.query(insertVendorQuery, [name, gmail, password, category, 'vendor'], (err, result) => {
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }
            res.json({ success: true, message: 'Vendor created successfully!' });
        });
    });
});
// =========================================================================================
app.get("/vendorhomepage/:id1",(req,res)=>{
    const Id = req.params.id1;

    const q = `select userid FROM user WHERE gmail = ? `;

    db.query(q,Id,(err,result)=>{
        if (err) {
            return res.json({ success: false, message: 'Database error. Please try again later.' });
        }
        res.render("vendor/vendorhomepage",{vendorId:result[0].userid});
    });

})
// =========================================================================================
app.get("/additem/:id1",(req,res)=>{
    const vendorId = req.params.id1;

    const q = `select username FROM user WHERE userid = ? `;
    const q1 = `select * from vendor WHERE vendorid = ? `;
    try{
        db.query(q,vendorId,(err,result)=>{
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }
            db.query(q1,vendorId,(err,result1)=>{
                if (err) {
                    return res.json({ success: false, message: 'Database error. Please try again later.' });
                }
                res.render("vendor/vendoradditem.ejs",{vendorid:vendorId,vendorName:result[0].username ,products:result1});
            })
        });
    }catch(error){
        return res.json({ success: false, message: error});
    }
});

app.post('/additem',(req, res) => {
    const { productname, price , id } = req.body;
    // console.log(productname,price,id)
    if (!productname || !price || !id) {
        return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    const query = 'INSERT INTO vendor (vendorid, productname, price, image) VALUES (?, ?, ?, ?)';
    const vendorid = id;
    const image = productname + 'image';

    db.query(query, [vendorid, productname, price, image], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Failed to add product!' });
        }
        res.json({ success: true, message: 'Product added successfully!' });
    });
});
// =========================================================================================
app.get("/vendoritem/:id1",(req,res)=>{
    const vendorId = req.params.id1;

    const q = `select username FROM user WHERE userid = ? `;
    const q1 = `select * from vendor WHERE vendorid = ? `;
    try{
        db.query(q,vendorId,(err,result)=>{
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }
            db.query(q1,vendorId,(err,result1)=>{
                if (err) {
                    return res.json({ success: false, message: 'Database error. Please try again later.' });
                }
                // console.log(result1[0]);
                res.render("vendor/vendoritem.ejs",{vendorid:vendorId,vendorName:result[0].username,products:result1});
            })
        });
    }catch(error){
        return res.json({ success: false, message: error});
    }
})
// ==============================================================================
app.get("/vendorhome",(req,res)=>{
    const q =`select * from user WHERE status = 'vendor'`;
    try{
        db.query(q,(err,result)=>{
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }
            // console.log(result);
            res.render("vendor/vendorhome.ejs",{vendors:result});
        });
    }catch(error){
        return res.json({ success: false, message: error});
    }
});

app.get("/userproduct/:id",(req,res)=>{
    const vendorId = req.params.id;

    const q = `select username FROM user WHERE userid = ? `;
    const q1 = `select * from vendor WHERE vendorid = ? `;
    try{
        db.query(q,vendorId,(err,result)=>{
            if (err) {
                return res.json({ success: false, message: 'Database error. Please try again later.' });
            }
            db.query(q1,vendorId,(err,result1)=>{
                if (err) {
                    return res.json({ success: false, message: 'Database error. Please try again later.' });
                }
                console.log(result1);
                res.render("user/userproduct.ejs",{vendorid:vendorId,vendorName:result[0].username,products:result1});
            })
        });
    }catch(error){
        return res.json({ success: false, message: error});
    }
})
app.get("/usercart",(req,res)=>{
    res.render("user/usercart.ejs");
})
app.get("/userhome",(req,res)=>{
    res.render("user/userhome.ejs");
})
app.get("/usercheckout",(req,res)=>{
    res.render("user/usercheckout.ejs");
})
app.get("/usersucess",(req,res)=>{
    res.render("user/usersucess.ejs");
})

