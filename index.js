const rides = require("./src/models/schema");
const app = require("./src/app");
const { logger } = require("./src/helpers/logger");
const db = require("./src/db/sqlite");
const port = 8020;

db.serialize(() => {
  rides.CreateTableRides(db);

  app().listen(port, () => logger.info(`date: ${new Date()}, msg: App started and listening on port ${port}`));
});
