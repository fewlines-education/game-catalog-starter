/* eslint-disable @typescript-eslint/no-var-requires */
const mongo = require("mongodb");
const games = require("./games.json");
const dotenv = require("dotenv")

dotenv.config()

let databaseUrl = process.env.MONGO_URL || "";

if (process.env.HEROKU_APP_NAME) {
  const url = new URL(databaseUrl)
  const herokuAppNameParts = process.env.HEROKU_APP_NAME.split("-");
  url.pathname = `${herokuAppNameParts[herokuAppNameParts.length - 1]}-${url.pathname.slice(1)}`
  databaseUrl = url.toString();
}

mongo.MongoClient.connect(databaseUrl).then((client) => {
  return client
    .db()
    .collection("games")
    .drop()
    .catch(() => {
      console.log("No games collection found, creating one...");
    })
    .then(() => client.db().collection("games").insertMany(games))
    .then(() => {
      client.close();
      console.log("Database populated");
    });
});
