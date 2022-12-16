require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const paypal = require("paypal-rest-sdk");

const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const lessonRouter = require("./routes/lesson");
const chapterRouter = require("./routes/chapter");

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/project`);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// TEST PAYPAL
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

app.post("/pay", (req, res) => {
  const { title, desc, cost, id, lessonId } = req.body;
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://localhost:3000/paySuccess/${cost}/${id}/${lessonId}`,
      cancel_url: "http://localhost:3000/payFail",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: title,
              sku: desc,
              price: cost,
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: cost,
        },
        description: desc,
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.send({ link: payment.links[i].href });
        }
      }
    }
  });
});

app.get("/success/:cost", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: req.params.cost,
        },
      },
    ],
  };
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        res.send({ success: true, message: "thanh toan thanh cong" });
      }
    }
  );
});

app.get("/cancel", (req, res) =>
  res.send({ success: false, message: "Don hang da huy" })
);

///////////////////////////////////////////

app.use("/api/auth", authRouter);
app.use("/api/course", courseRouter);
app.use("/api/chapter", chapterRouter);
app.use("/api/lesson", lessonRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
