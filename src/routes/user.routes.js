const express = require("express");
const { registerUser } = require("../controllers/user.controller");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");

router.route("/register").post(
    upload.fields([              //we are accepting two files
        { name: 'avatar', maxCount: 1 },     
        { name: 'coverImage', maxCount: 1 }
    ]), 
    registerUser
);

module.exports = router;
