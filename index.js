const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y6nft.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const productCollection = client.db("emaJohn").collection("product");

    // get
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const page = parseInt(req?.query?.page);
      const size = parseInt(req?.query?.size);
      console.log(page, size);

      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }
      res.send(products);
    });

    // get count
    app.get("/productCount", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const count = await cursor.count();
      res.send({ count: count });
    });

    // get product
    // app.get('/getProduct', (req, res) => {
    //     const id = req.query;

    //     const query =
    // })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Ema john server is running....");
});

app.listen(port, () => {
  console.log("Listening to port is", port);
});
