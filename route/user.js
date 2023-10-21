const express = require("express");
const route = express.Router();
const {
    getAllUsers,
    getUser,
    uploadProfilePicture
} = require("../controller/user");
const {protect} = require("../middleware/auth")
const upload = require("../middleware/upload")

route.get("/", protect, getAllUsers);
route.get("/:userid", protect, getUser);
route.post("/upload", protect, upload('images').single("file"), uploadProfilePicture);

module.exports = route;