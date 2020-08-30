//import libraries
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const bodyParser = require("body-parser");

//initialize firebase in order to access its services
admin.initializeApp(functions.config().firebase);

//initialize express server
const app = express();
const main = express();

//add the path to receive request and set json as bodyParser to process the body
main.use("/api/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

//initialize the database and the collection
const db = admin.firestore();
const productCollection = "products";

//define google cloud function name
exports.webApi = functions.https.onRequest(main);

// post to products collection
app.post("/all-products", async (req, res) => {
  try {
    const product = {
      name: req.body["name"],
      price: req.body["price"],
      description: req.body["description"],
      category: req.body["category"],
      id: req.body["id"],
    };

    const newDoc = await db.collection(productCollection).add(product);
    res.status(201).send(`Created new product: ${newDoc.id}`);
  } catch (error) {
    res.status(400).send(`${error}`);
  }
});

// get all products
app.get("/all-products", async (req, res) => {
  try {
    const snapshot = await db.collection(productCollection).get();
    const resDocs = snapshot.docs.map((doc) => doc.data());
    res.send(resDocs);
  } catch (error) {
    res.status(500).send(error);
  }
});
