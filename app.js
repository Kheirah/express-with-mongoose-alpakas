require("dotenv").config();
const express = require("express");
const connect = require("./lib/connect");
const Note = require("./model/Notes");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

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

app.post("/", async (request, response) => {
  await connect();
  const { value } = request.body;

  try {
    const res = await Note.create({ content: value });
    return response.json({
      id: res._id,
      message: "Successfully created a new note.",
    });
  } catch (error) {
    return response.json({ message: "Could NOT create a new note.", error });
  }
});

app.get("/:id", async (request, response) => {
  await connect();
  const { id } = request.params;

  try {
    const note = await Note.findOne({ _id: id });
    return response.json(note);
  } catch (error) {
    return response.json({ message: "Could NOT find the note.", error });
  }
});

const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
