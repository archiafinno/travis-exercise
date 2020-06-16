const express = require("express");

const app = express();
const bodyParser = require("body-parser");
const RidesController = require("./controllers");

const jsonParser = bodyParser.json();

module.exports = () => {
  app.get("/health", (req, res) => res.send("Healthy"));
  app.get("/rides", RidesController.GetRides);
  app.get("/rides/:id", RidesController.GetRideById);
  app.post("/rides", jsonParser, RidesController.PostRide);

  return app;
};
