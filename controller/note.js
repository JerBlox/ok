const asyncFunc = require("../middleware/async");
const Note = require("../models").Note;
const User = require("../models").User;
const { Op } = require("sequelize");
const ErrorResponse = require("../utils/ErrorResponse");

exports.getAllNotes = asyncFunc(async (req, res, next) => {
    console.log(req.user);
    const query = req.query;
    console.log(query);
    const checklist = req.query.checklist;
    const title = req.query.title;
    console.log(checklist, title);

    const condition = {};
    if(checklist == "true"){
        condition.checklist = true;
    } else {
        condition.checklist = false;
    }
    if(title){
        condition.title = {[ Op.like ]: `%${title}%`};
    }

    const notes = await Note.findAll({
        // select only specific fields:
        // attributes: ["id", "title"],
        where: condition,
        order: [["checklist", "ASC"]],
        include: {
            model: User,
            as: "user",
            where: {
                id: req.user.id,
            }
        },
    });

    res.status(200).json({
        message: "Get All Notes",
        data: notes,
    })
})

exports.getNoteById = asyncFunc(async (req, res, next) => {
    const id = req.params.noteid

    const note = await Note.findByPk(id);

    res.status(200).json({
        message: `Get Note Id = ${id}`,
        data: note,
    })
})

exports.createNote = asyncFunc(async (req, res, next) => {
    const { title, note } = req.body;
    const user = await User.findByPk(req.user.id);
    if(!user){
        return next(new ErrorResponse("Not Found", 404));
    }

    const noteData = await Note.create({
        title: title,
        note: note,
        checklist: false,
        user_id: user.id,
    });

    res.status(200).json({
        message: "Create Note",
        data: noteData,
    })
})

exports.updateNote = asyncFunc(async (req, res, next) => {

    const id = req.params.id;
    const { title, note, checklist } = req.body;

    /* 
    const noteData = await Note.update({
        title: title,
        note: note,
        checklist: checklist,
    },
    {
        where: {
            id: id,
        },
    });
    */

    const noteData = await Note.findByPk(id);
    
    if(noteData.user_id !== req.user.id){
        return next(new ErrorResponse("Unauthorized access to note", 401))
    }

    noteData.title = title;
    noteData.note = note;
    noteData.checklist = checklist;
    noteData.save();
    

    res.status(200).json({
        message: "Update Note",
        data: noteData,
    })
})

exports.deleteNote = asyncFunc(async (req, res, next) => {
    const id = req.params.id;
    const noteData = await Note.findByPk(id);
    noteData.destroy();

    res.status(200).json({
        message: `Note ${id} Deleted!`
    })
})