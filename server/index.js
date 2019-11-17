const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const db_config = require("./config/database");
const helmet = require("helmet");
const compression = require("compression");
const fs = require("fs");
const stringUtil = require("./stringUtil");
const servers = require("../../servers");

if (!fs.existsSync("./uploadedFiles")) {
  fs.mkdirSync("./uploadedFiles");
}
if (!fs.existsSync("./uploadedFiles/thumbnails")) {
  fs.mkdirSync("./uploadedFiles/thumbnails");
}

mongoose.connect(db_config.database, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("Connected to database " + db_config.database);
});
mongoose.connection.on("error", err => {
  console.log("Database error: " + err);
});

let server = require("http").createServer();
const app = express();
server.on("request", app);

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(compression());

fs.readdirSync(path.join(__dirname, "routes")).forEach(file => {
  const split = file.split(".");

  const name =
    split[split.length - 1] !== "js" ? file : split.slice(0, -1).join(".");

  app.use(
    `/api/${stringUtil.camelCaseToDash(name)}`,
    require(`./routes/${name}`)
  );
});

app.get("/api/*", (req, res) => {
  res.status(404).json("Not Found");
});

app.use("/", express.static(path.join(__dirname, "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(function(err, req, res, next) {
  res.status(err.statusCode || 500).send(err.message);
});

const port = servers.getPort("juicy_soup");
server.listen(port, () => console.log("Server started on port " + port));
