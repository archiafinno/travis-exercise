const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:");

db.allAsync = function dbAll(sql) {
  const that = this;
  return new Promise(((resolve, reject) => {
    that.all(sql, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  }));
};

db.runAsync = function dbRun(sql) {
  return new Promise((resolve, reject) => {
    this.run(sql, function executeRun(err) {
      if (err) {
        reject(err);
      } else resolve(this);
    });
  });
};

module.exports = db;
