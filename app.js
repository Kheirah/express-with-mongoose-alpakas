require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./lib/connect");
const Note = require("./model/Notes");
const User = require("./model/Users");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", async (request, response) => {
  response.json({ message: "Welcome to the note-taking app with MongoDB!" });
});

app.post("/", async (request, response) => {
  await connect();
  const { username } = request.body;

  try {
    const res = await User.create({ name: username });
    response.json({ id: res._id, message: "Successfully created a new user." });
  } catch (error) {
    response.json({ message: "Could NOT create a new user.", error });
  }
});

app.get("/:user", async (request, response) => {
  await connect();
  const { user } = request.params;

  const foundUser = await User.findOne({ name: user });

  if (foundUser) {
    try {
      const notes = await Note.find({ userId: foundUser._id }).populate(
        "userId"
      );
      response.json(notes);
    } catch (error) {
      response.json({ message: "An error occured", error });
    }
  } else {
    response.json({ message: "Could NOT find the user." });
  }
});

app.post("/:user", async (request, response) => {
  await connect();

  const { user } = request.params;
  const { content } = request.body;
  try {
    const foundUser = await User.findOne({ name: user });
    console.log(foundUser);

    if (foundUser) {
      const res = await Note.create({ content, userId: foundUser._id });
      return response.json({
        id: res._id,
        message: `Successfully created a new note for ${user}.`,
      });
    } else {
      response.json({ message: "Could NOT find the user." });
    }

    response.json(foundUser);
  } catch (error) {
    response.json({ message: "An error occured.", error });
  }
});

/* This route/endpoint is optional. The frontend does not require it. */
app.get("/users", async (request, response) => {
  await connect();

  try {
    const users = await User.find();
    response.json(users);
  } catch (error) {
    response.json({ message: "An error occured.", error });
  }
});

/* get an individual note from a user */
app.get("/:user/:note", async (request, response) => {
  await connect();
  const { user } = request.params;

  try {
    const note = await Note.findOne({ _id: id });
    return response.json(note);
  } catch (error) {
    return response.json({ message: "Could NOT find the note.", error });
  }
});

/* update an individual note from a user */
app.put("/:user/:note", async (request, response) => {
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

/* delete an individual note from a user */
app.delete("/:user/:note", async (request, response) => {
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
