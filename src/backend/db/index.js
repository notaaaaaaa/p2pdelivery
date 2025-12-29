const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "ownapp1",
  password: "psbb",
  port: 5432,
});

// Connect to the database
client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("Connection error", err.stack));

  module.exports = {
    client,
    query: (text, params) => client.query(text, params),
  };
