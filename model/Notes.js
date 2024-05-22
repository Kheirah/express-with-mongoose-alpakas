const mongoose = require("mongoose");

const { Schema } = mongoose;

/* Definition of what a document looks like */
const noteSchema = new Schema(
  {
    content: { type: String, required: true },
  },
  { versionKey: false }
);

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

module.exports = Note;
