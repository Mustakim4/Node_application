const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const dotenv = require("dotenv");
const Register = require("./server/models/register");
const bcrypt = require("bcryptjs");

// requiring database connection
const connectDB = require("./server/database/connection");

// requiring dotenv file
dotenv.config( { path: "config.env"})
const PORT = process.env.PORT || 8080;

// buildin middleware
const staticPath = path.join(__dirname,"./public");
app.use(express.static(staticPath))

// mongodb connection
connectDB();

// set view engine
const template_path = path.join(__dirname, "./templates/views");

app.set("view engine", "hbs");
app.set("views", template_path);

// setting partials file
const partialsPath = path.join(__dirname, "./templates/partials");
hbs.registerPartials(partialsPath);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routing 
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res)=>{
  try {
    
    const user = new Register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      gender: req.body.gender,
      status: req.body.status,
    })

    const userAdded = await user.save();
    res.status(201).render("render")

  } catch (error) {
      res.status(400).send()
    }
});

app.get("/login", (req, res) => {
  res.render("login");
});

// login system
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.status(201).render("render");
    } else {
      res.status(400).send("Invalid details");
    }
  } catch (error) {
    res.status(400).send("Invalid details");
  }
});

app.get("/render", (req, res) => {
  res.render("render");
});

app.listen(PORT, () => {
  console.log(`port is listening on http://localhost:${PORT}`);
});
