module.exports.ValidationCreate = (req) => {
  const startLatitude = Number(req.body.start_lat);
  const startLongitude = Number(req.body.start_long);
  const endLatitude = Number(req.body.end_lat);
  const endLongitude = Number(req.body.end_long);
  const riderName = req.body.rider_name;
  const driverName = req.body.driver_name;
  const driverVehicle = req.body.driver_vehicle;

  const checkStartLat = startLatitude < -90 || startLatitude > 90;
  const checkStartLong = startLongitude < -180 || startLongitude > 180;
  if (checkStartLat || checkStartLong) {
    return {
      status: 400,
      result: {
        error_code: "VALIDATION_ERROR",
        message: "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      },
    };
  }

  const checkEndLat = endLatitude < -90 || endLatitude > 90;
  const checkEndLong = endLongitude < -180 || endLongitude > 180;
  if (checkEndLat || checkEndLong) {
    return {
      status: 400,
      result: {
        error_code: "VALIDATION_ERROR",
        message: "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively",
      },
    };
  }

  if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
    return {
      status: 400,
      result: {
        error_code: "VALIDATION_ERROR",
        message: "Driver vehicle must be a non empty string",
      },
    };
  }

  if (typeof driverName !== "string" || driverName.length < 1) {
    return {
      status: 400,
      result: {
        error_code: "VALIDATION_ERROR",
        message: "Driver name must be a non empty string",
      },
    };
  }

  if (typeof riderName !== "string" || riderName.length < 1) {
    return {
      status: 400,
      result: {
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string",
      },
    };
  }

  return null;
};
