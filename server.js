const express = require("express");
const app = express();


const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const {
  getAllDataByCity,
  getAllDataByIp,
  getForCastByCity,
} = require("./apis/weather");

const tweet = require("./controller/twitter");
// const draw = require("./controller/draw")
const { saveData, saveForecast } = require("./controller/collections");

app.use(cors());

app.use(checkapikey);

app.get("/byip", async (req, res) => {
  const ipAddresses = req.header("x-forwarded-for");
  console.log("getting request");
  await getAllDataByIp(ipAddresses)
    .then((response) => res.send(response))
    .catch((err) => {
      console.error(`{"message": ${err}, "task":"/ get"}`);
    });
});

app.get("/weather/:city", async (req, res) => {
  await getAllDataByCity(req.params.city)
    .then(async (result) => {
      result.cached = await saveData(req.params.city, result);

      if (result.Weather.weather[0].description != undefined) {

        await tweet(result);
      }
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(`{"message": ${err}}, "task":"get weather/:city"`);
    });
});

app.get("/forcast/:city", async (req, res) => {
  await getForCastByCity(req.params.city)
    .then(async (result) => {
      result.cached = await saveForecast(req.params.city, result);

      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).send(`{"message": ${err}}, "task":"get weather/:city"`);
    });
});

app.get("/alumadoluma", (req, res) => {
  const id = crypto.randomBytes(10).toString("hex");
  res.send(id);
});
app.get("/env", (req, res) => {
  res.send(process.env.FIREBASE_ADMIN_SDK);
});

app.get("/draw", async (req, res) => {
  
//   let b64img = await draw(23103000123, '01d', 28, 5.16, 'Kandy')
  res.send(`<img src='' alt='image' />`)
});
app.get("/calback/tweet", async (req, res) => {

  res.send("hello");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

function checkapikey(req, res, next) {
  const apikeys = [
    "s9KLjNhRjbvH1kILvTqI",
    "76x8aYD1Ss36IbVWAG",
    "3pF4SnRVhFRVzH0luGP1",
    "EsFCg9VqMPmmSChIdBSY",
    "Ch0h2SiGKZW3cBHrFgGO",
    "6v0SYvxtg2jXiJd2MKKi",
    "TmZcEX1iV1efM2kQOM9J",
    "GLIHT5ll40TA53dCNXhI",
    "lG7FUAjs5TCv2rW0rvX7",
    "0dYPPD8MlNkOlad5WuLh",
  ];

  let apikey = req.query.apikey;

  if (apikey === undefined) {
    res
      .status(401)
      .json({ message: "Missing API Key, Contact Ahzam", apikey: apikey });
  } else if (apikeys.includes(apikey)) {
    next();
  } else {
    res
      .status(401)
      .send({ message: "Unautharized User", apikey: apikey, verified: false });
  }
}
