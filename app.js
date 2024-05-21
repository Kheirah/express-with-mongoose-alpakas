require("dotenv").config();
const express = require("express");
const connect = require("./lib/connect");
const Note = require("./model/Notes");
const app = express();
const port = process.env.PORT || 3000;

/* todo
- [ ] add CORS package
*/

app.get("/", async (req, res) => {
  await connect();
  const notes = await Note.find();

  if (notes.length === 0) {
    return res.json({ message: "Notes could not be found." });
  }

  res.json(notes);
});

const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
