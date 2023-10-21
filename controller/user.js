const asyncFunc = require("../middleware/async");
const Note = require("../models").Note;
const User = require("../models").User;
const { Op } = require("sequelize");
const upload = require("../models").upload;

exports.getAllUsers = asyncFunc(async (req, res, next) => {

    const users = await User.findAll({
        include: {
            model: Note,
            as: "note",
        },
    });

    res.status(200).json({
        message: "Get All Users",
        data: users,
    })
});

exports.getUser = asyncFunc(async (req, res, next) => {
    const id = req.params.userid

    const user = await User.findByPk(id);

    res.status(200).json({
        message: `Get User with Id = ${id}`,
        data: user,
    })
});

exports.uploadProfilePicture = asyncFunc(async (req, res, next) => {
    const user_id = req.user.id;
    const { filename, path, mimetype } = req.file;

    const publicIndex = path.indexOf('\\public');
    const newPath = path.substring(publicIndex);

    const Upload = await upload.create({
        file_name: filename,
        file_path: newPath,
        file_type: mimetype,
        user_id,
    })

    res.status(201).json({
        message: "Image Uploaded",
        data: Upload,
    })

})