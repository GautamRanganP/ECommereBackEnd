require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./model/user");
const Poll = require("./model/product")
const Cart = require("./model/cart")
const Employee = require("./model/employee")
const auth = require("./middleware/auth");
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());



app.post("/register", async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email }).exec();

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email }).exec();

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "1h",
                }
            );

            // save user token
            user.token = token;
            // user
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});

app.get("/getuser/:id", async (req, res) => {
    try {
        const userInfo = await Cart.find({ userId: req.params.id }).exec();
        res.status(200).send({
            "status": "success",
            "data": userInfo
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
})


app.post("/createproduct", async (req, res) => {
    const { title, price, description, image, category } = req.body;
    try {
        const poll = new Poll({ title, price, description, image, category });
        await poll.save();
        res.status(200).send({
            "status": "Success",
            "message": "Product Added Successfully",
            "data": poll
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
})

app.put('/updateproduct/:id', auth, async (req, res) => {
    const { title, price, description, image, category } = req.body;
    try {
        await Poll.findByIdAndUpdate(req.params.id, { title, price, description, image, category }).exec();
        res.status(200).send({
            "status": "success",
            "message": "Poll was updated Succesfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
});

app.delete("/deleteproduct/:id", auth, async (req, res) => {
    try {
        await Poll.findByIdAndDelete(req.params.id).exec();
        res.status(200).send({
            "status": "success",
            "message": "Poll was Deleted Succesfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
})


app.get("/getallproduct", async (req, res) => {
    try {
        const poll = await Poll.find({}).exec();
        res.status(200).send(poll)
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
})

app.get("/getproduct/:id", async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id).exec();
        res.status(200).send(poll)
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
});

app.post("/addcart", async (req, res) => {
    const { userId, date, products } = req.body;
    try {
        const cart = new Cart({ userId, date, products });
        await cart.save()
        res.status(200).send(cart)
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
});

app.put("/updatecart/:id", async (req, res) => {
    const { products } = req.body
    try {
        await Cart.findByIdAndUpdate(req.params.id, { products }).exec();
        res.status(200).send({
            "status": "success",
            "message": "Cart was updated Succesfully"
        })
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
});

app.delete("/deletecart/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id).exec();
        res.status(200).send({
            "status": "success",
            "message": "Poll was Deleted Succesfully"
        })
    } catch (error) {
        res.status(500).send("internal server error");
    }
});

app.get("/getallcart", async (req, res) => {
    try {
        const poll = await Cart.find({}).exec();
        res.status(200).send(poll)
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
})

app.get("/getusercart/:id", async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).exec();
        res.status(200).send(cart)
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
})


app.get("/", async (req, res) => {
    res.status(200).send("Welcome to Ecommerce");
})
app.post("/employee", async (req, res) => {
    const { employeeID, employeeName, employeeEmail, certifications } = req.body;
    try {
        const existingEmployee = await Employee.findOne({ employeeID });
        // const existingCertifications = await Employee.findOne({
        //     certifications: { $elemMatch: { name: certifications.name, issuer: certifications.issuer } }
        // });
        if (existingEmployee) {
            const existingCertifications = existingEmployee.certifications.some(cert => {
                return cert.name === certifications.name && cert.issuer === certifications.issuer;
            });
            if (existingCertifications) {
                return res.status(400).send('Certification already exists for this employee');
            }
            existingEmployee.certifications.push(...certifications);
            await existingEmployee.save();
            res.status(200).send(employee)
        }
        const employee = new Employee({ employeeID, employeeName, employeeEmail, certifications });
        await employee.save()
        res.status(200).send(employee)
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
});

app.get("/getallemployee", async (req, res) => {
    try {
        const employee = await Employee.find({}).exec();
        res.status(200).send(employee)
    } catch (error) {
        console.error(error);
        res.status(500).send("internal server error");
    }
})
// This should be the last route else any after it won't work
app.use("*", (req, res) => {
    res.status(404).json({
        success: "false",
        message: "Page not found",
        error: {
            statusCode: 404,
            message: "You reached a route that is not defined on this server",
        },
    });
});

module.exports = app;
