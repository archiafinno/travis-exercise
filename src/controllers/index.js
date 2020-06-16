
const db = require("../db/sqlite");
const RidesModel = require("../models");
const { customLogger } = require("../helpers/logger");


class RidesController {
  static async GetRides (req, res) {
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const offset = limit * (page - 1);
  
    const result = await RidesModel.GetRides(db, limit, offset);
    if (result.status == 200) {
      customLogger("info", "Successfully fetching rides", req, result.result)
      return res.status(result.status).send(result.result);
    } else {
      customLogger("error", result.result.message, req)
      return res.status(result.status).send(result.result);
    }
  };

  static async GetRideById (req, res) {
    const result = await RidesModel.GetRideById(db, req.params.id);
    if (result.status == 200) {
      customLogger("info", "Successfully fetching ride by id", req, result.result)
      return res.status(result.status).send(result.result);
    } else {
      customLogger("error", result.result.message, req)
      return res.status(result.status).send(result.result);
    }
  };

  static async PostRide (req, res) {
    const result = await RidesModel.PostRide(db, req);
    if (result.status == 201) {
      customLogger("info", "Successfully post ride", req, result.result)
      return res.status(result.status).send(result.result);
    } 
    else {
      customLogger("error", result.result.message, req)
      return res.status(result.status).send(result.result);
    }
  };
}

module.exports = RidesController

