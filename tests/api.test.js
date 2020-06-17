const request = require("supertest");
const db = require("../src/db/sqlite");

const app = require("../src/app")(db);
const rides = require("../src/models/schema");

let payload = {
  start_lat: 0,
  start_long: 0,
  end_lat: 0,
  end_long: 0,
  rider_name: "Ujang",
  driver_name: "Sarita",
  driver_vehicle: "Mercedes",
}

describe("API tests", () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      rides.CreateTableRides(db);
      done();
    });
  });

  describe("GET /health", () => {
    it("should return health", (done) => {
      request(app)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });

  describe("GET /rides no data", () => {
    const msg = {
      error_code: "RIDES_NOT_FOUND_ERROR",
      message: "Could not find any rides",
    }
    it("should return not found error", (done) => {
      request(app)
        .get("/rides")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(404, msg, done);
    });
  });

  describe("GET /rides/:id no data", () => {
    it("should return not found error", (done) => {
      const msg = {
        error_code: "RIDES_NOT_FOUND_ERROR",
        message: "Could not find any rides",
      }
      request(app)
        .get("/rides/1")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(404, msg, done);
    });
  });

  describe("POST /rides", () => {
    it("should return success", (done) => {
      request(app)
        .post("/rides")
        .send(payload)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(201, done);
    });

    it("should return error response because invalid start location", (done) => {
      const invalidStart = {...payload }
      invalidStart.start_lat = -190
      invalidStart.start_long = 190
      const msg = {
        error_code: "VALIDATION_ERROR",
        message: "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      }
      request(app)
        .post("/rides")
        .send(invalidStart)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, msg, done);
    });

    it("should return error response because invalid end location", (done) => {
      const invalidEnd = {...payload }
      invalidEnd.end_lat = -190
      invalidEnd.end_long = 190
      const msg = {
        error_code: "VALIDATION_ERROR",
        message: "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      }
      request(app)
        .post("/rides")
        .send(invalidEnd)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, msg, done);
    });

    it("should return error because invalid rider name", (done) => {
      const invalidRiderName = {...payload }
      invalidRiderName.rider_name = ""
      const msg = {
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string",
      }
      request(app)
        .post("/rides")
        .send(invalidRiderName)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, msg, done);
    });

    it("should return error because invalid driver name", (done) => {
      const invalidDriverName = {...payload }
      invalidDriverName.driver_name = ""
      const msg = {
        error_code: "VALIDATION_ERROR",
        message: "Driver name must be a non empty string",
      }
      request(app)
        .post("/rides")
        .send(invalidDriverName)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, msg, done);
    });

    it("should return error because invalid vehicle name", (done) => {
      const invalidVehicle = {...payload }
      invalidVehicle.driver_vehicle = ""
      const msg = {
        error_code: "VALIDATION_ERROR",
        message: "Driver vehicle must be a non empty string",
      }
      request(app)
        .post("/rides")
        .send(invalidVehicle)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(400, msg, done);
    });

    it("should return server error when post ride because of SQL Injection", (done) => {
      const invalidStartLat = {...payload }
      invalidStartLat.start_lat = "'"
      const msg = {
        error_code: "SERVER_ERROR",
        message: "Unknown error",
      }
      request(app)
        .post("/rides")
        .send(invalidStartLat)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(500, msg, done);
    });
  });

  describe("GET /rides with data", () => {
    it("should return success", (done) => {
      request(app)
        .get("/rides")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200, done);
    });
  });

  describe("GET /rides with pagination params page=2&limit=4", () => {
    before((done) => {
      db.serialize((err) => {
        if (err) {
          return done(err);
        }
        const values = [payload.start_lat, payload.start_long, payload.end_lat, payload.end_long, payload.rider_name, payload.driver_name, payload.driver_vehicle];
        const insertQuery = "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const numDummy = 10
        for (let i = 0; i < numDummy; i++) {
          db.run(insertQuery, values, (err) => {});
        }
        done();
      });
    });

    it("should return success for pagination", (done) => {
      request(app)
        .get("/rides?page=2&limit=4")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200, done);
    });

    it("should return server error when fetching with pagination because of SQL Injection", (done) => {
      const msg = {
        error_code: "SERVER_ERROR",
        message: "Unknown error",
      }
      request(app)
        .get("/rides?page='&limit='")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(500, msg, done);
    });
  });

  describe("GET /rides/:id with data", () => {
    it("should return success", (done) => {
      request(app)
        .get("/rides/1")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(200, done);
    });

    it("should return server error when fetching by id because of SQL Injection", (done) => {
      const msg = {
        error_code: "SERVER_ERROR",
        message: "Unknown error",
      }
      request(app)
        .get("/rides/'")
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect(500, msg, done);
    });
  });
});
