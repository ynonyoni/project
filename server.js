const express = require("express");
const app = express();

const bp = require("body-parser");
app.use(express.static("client"));
app.use(bp.json());
app.use(bp.urlencoded());

const db = require("mongoose");


db.connect(
//  "mongodb+srv://hadas:hy1234hy@cluster0.nefe6tn.mongodb.net/svshopDb"
      "mongodb+srv://ynon:ChyEqc7VUc7GbxfV@cluster0.kdysbnh.mongodb.net/svshopDb" //ynon
);

const userSchema = db.Schema({
  name: String,
  email: String,
  password: String,
});

const usersModel = db.model("users", userSchema);

const productSchema = db.Schema({
  name: String,
  price: Number,
  select: Boolean,
});

const productsModel = db.model("products", productSchema);

const orderSchema = db.Schema({
  name: String,
  email: String,
  products: Array, //list {name,price} products[productSchema]
  confirm: Boolean,
});

const ordersModel = db.model("orders", orderSchema);

// ----------------- Sign In -------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/signIn.html");
});

app.post("/userValidation", async (req, res) => {
  let { email, password } = req.body;
  try {
    let result = await usersModel.find({ email, password }); // return array
    if (result.length === 0) {
      result = await usersModel.find({ email }); 
      if (result.length) {
        res.json({ error: "You entered an incorrect password" });
      } else {
        res.json({error: "No users found, please create an account, click on signUp button" });
      }
    } else {
      //? goto prouducts list
      res.json({ url: "/products", name: result[0].name });
    }
      
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ----------------------- SIGN UP --------------------------------------/

app.get("/signUp", (req, res) => {
  res.sendFile(__dirname + "/client/signUp.html");
});

app.post("/addNewUser", async (req, res) => {
  let user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    let result = await usersModel.find({ email: user.email }); // return array
    if (result.length) {
      res.json({ error: "The user exists in the system" });
    } else {
      await usersModel.insertMany(user);
      //? goto prouducts list
      res.json({ url: "/products" });
    }
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }

  
});

//====================== P R O D U C T S ===============================/

const productsArr = [
  {
    name: "Set of 4 rings",
    price: 132,
    select: false,
  },
  {
    name: "Ring",
    price: 76,
    select: false,
  },
  {
    name: "Set of 3 bracelets",
    price: 215,
    select: false,
  },
  {
    name: "Bracelet",
    price: 113,
    select: false,
  },
  {
    name: "Set of 3 necklace",
    price: 300,
    select: false,
  },
  {
    name: "Necklace",
    price: 125,
    select: false,
  },
  {
    name: "Set of 4 earrings",
    price: 200,
    select: false,
  },
  {
    name: "Earrings",
    price: 90,
    select: false,
  },
  {
    name: "Gold chain",
    price: 200,
    select: false,
  },
  {
    name: "Silver chain",
    price: 250,
    select: false,
  },
  {
    name: "Leg bracelet",
    price: 75,
    select: false,
  },
  {
    name: "Set of 5 earrings",
    price: 220,
    select: false,
  },
  {
    name: "Bag",
    price: 200,
    select: false,
  },
  {
    name: "Choker necklace",
    price: 199,
    select: false,
  },
  {
    name: "Glasses",
    price: 175,
    select: false,
  },
  {
    name: "Sunglasses",
    price: 97,
    select: false,
  },
  {
    name: " Bead necklace",
    price: 163,
    select: false,
  },
  {
    name: "Scarf",
    price: 68,
    select: false,
  },
  {
    name: "Hair bands",
    price: 10,
    select: false,
  },
  {
    name: "Leather Wallet",
    price: 156,
    select: false,
  },
  {
    name: "Wallet",
    price: 123,
    select: false,
  },
  {
    name: "Watch",
    price: 123,
    select: false,
  },
  {
    name: "Hat",
    price: 123,
    select: false,
  },
  {
    name: "Gloves",
    price: 123,
    select: false,
  },
  {
    name: "Socks",
    price: 123,
    select: false,
  },
  {
    name: "Umbrella",
    price: 123,
    select: false,
  },
  {
    name: "Shoes",
    price: 13,
    select: false,
  },
  {
    name: "Tie",
    price: 12,
    select: false,
  },
  {
    name: "Hair clip",
    price: 13,
    select: false,
  },
  {
    name: "Airpods",
    price: 231,
    select: false,
  },
];

app.get("/products", async (req, res) => {
  //await productsModel.insertMany(productsArr);
  res.sendFile(__dirname + "/client/products.html");
});

app.get("/getProducts", async (req, res) => {
  try {
    let products = await productsModel.find({}).select("-_id -__v");
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//====================== B U Y ===============================/
app.get("/buy", (req, res) => {
  res.sendFile(__dirname + "/client/buy.html");
});

app.post("/saveOrder", async (req, res) => {
  const order = {
    name: req.body.name,
    email: req.body.email,
    products: req.body.order,
    confirm: false,
  };
  try {
    const result = await ordersModel.insertMany(order);
    res.json({ url: "/buy", _id: result[0]._id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// =======================================================================סגירה שלי עד כאן מוצרים ומכאן BUY
app.post("/approveOrder", async (req, res) => {
  try {
    const result = await ordersModel.findOneAndUpdate(
      { _id: req.body.orderId }, // Filter: Find the document with the specified ID
      { confirm: true } // Update: Set the 'name' field to the new value
    );
    res.json({ url: "/exit" });  
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });   
  }
});
//======================= E X I T =============================/
app.get("/exit", (req, res) => {
  res.sendFile(__dirname + "/client/exit.html");
});

//========================= A D M I N =========================/
app.get("/all", middleExample, (req, res) => {
  res.sendFile(__dirname + "/client/orders.html");
});

app.get("/getOrdersApprove", async (req, res) => {
  try {
    const orders = await ordersModel.find({ confirm: true }).select("-__v -confirm");
    if (orders.length === 0) {
      res.json({ error: "There are no orders" });
    } else {
      res.json({ orders });
    }   
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });   
  }
});

function middleExample(req, res, next) {
  if (req.query.admin == "true") {
    next();
  } else {
    res.status(400).json({ error: "you are not admin" });
  }
}

app.listen(3000, () => {
  console.log("server listen to 3000");
});
