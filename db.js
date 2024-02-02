const mysql = require("mysql2/promise");

const config = {
  db: {
    /* don't expose password or any sensitive info, done only for demo */
    host: "localhost",
    user: "root",
    password: "34stacin",
    database: "testDB",
    connectTimeout: 60000,
  },
  listPerPage: 10,
};

async function query(sql, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, params);

  console.log({ results });

  return results;
}

module.exports = { config, query };
