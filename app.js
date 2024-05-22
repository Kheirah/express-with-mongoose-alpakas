require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./lib/connect");
const Note = require("./model/Notes");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

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

app.put("/:id", async (request, response) => {
  await connect();
  const { id } = request.params;
  const { value } = request.body;

  try {
    const res = await Note.updateOne({ _id: id }, { content: value });
    if (res.modifiedCount === 1) {
      response.json({ message: "Successfully updated the note." });
    } else {
      response.json({ message: "Note could NOT be updated." });
    }
  } catch (error) {
    response.json({ message: "An error occurred.", error });
  }
});

app.delete("/:id", async (request, response) => {
  await connect();
  const { id } = request.params;

  try {
    const res = await Note.deleteOne({ _id: id });
    if (res.deletedCount === 1) {
      response.json({ message: "Note successfully deleted." });
    } else {
      response.json({ message: "Note could NOT be deleted." });
    }
  } catch (error) {
    response.json({ message: "An error occured.", error });
  }
});

const server = app.listen(port, () =>
  console.log(`Express app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
