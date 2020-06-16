const SqlString = require("sqlstring");
const validation = require("../helpers/validation");

class RidesModel {
  static async GetRides (db, limit, offset) {
    try {
      const getRidesQuery = SqlString.format("SELECT * FROM Rides LIMIT ? OFFSET ?", [limit, offset]);
      const rows = await db.allAsync(getRidesQuery);
      if (rows.length === 0) {
        return {
          status: 404,
          result: {
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides",
          }
        };
      }
      return {
        status: 200,
        result: rows
      };
    } catch (err) {
      return {
        status: 500, 
        result: {
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        }
      };
    }
  };

  static async PostRide (db, payload) {
    try {
      const payloadCheck = validation.ValidationCreate(payload);
      if (payloadCheck !== null) {
        return payloadCheck
      }
      const values = [payload.body.start_lat, payload.body.start_long,
        payload.body.end_lat, payload.body.end_long, payload.body.rider_name,
        payload.body.driver_name, payload.body.driver_vehicle];

      const insertQuery = SqlString.format("INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)", values);
      const insertedRow = await db.runAsync(insertQuery);
      const lastRide = await db.allAsync(SqlString.format("SELECT * FROM Rides WHERE rideID = ?", insertedRow.lastID));
      return {
        status: 201,
        result: lastRide
      };
    } catch (err) {
      return {
        status: 500, 
        result: {
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        }
      };
    }
  };

  static async GetRideById (db, id) {
    try {
      const findQuery = SqlString.format("SELECT * FROM Rides WHERE rideID=?", id);
      const rows = await db.allAsync(findQuery);
      if (rows.length === 0) {
        return {
          status: 404,
          result: {
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides",
          }
        };
      }
      return {
        status: 200,
        result: rows
      };
    } catch (err) {
      return {
        status: 500, 
        result: {
          error_code: "SERVER_ERROR",
          message: "Unknown error",
        }
      };
    }
  };
}

module.exports = RidesModel

