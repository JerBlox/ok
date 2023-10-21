const express = require("express");
const route = express.Router();
const {
    createNote,
    deleteNote,
    getAllNotes,
    getNoteById,
    updateNote
} = require("../controller/note");

const { protect } = require("../middleware/auth");

route.get("/", protect, getAllNotes);
route.get("/:noteid", protect, getNoteById);
route.post("/", protect, createNote);
route.put("/:id", protect, updateNote);
route.delete("/:id", protect, deleteNote);

module.exports = route;