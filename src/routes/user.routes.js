const express = require("express");
const { registerUser, loginUser, logOutUser, refreshAccessToken } = require("../controllers/user.controller");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const userAuth = require("../middlewares/auth.middleware");

router.route("/register").post(
    upload.fields([              //we are accepting two files
        { name: 'avatar', maxCount: 1 },     
        { name: 'coverImage', maxCount: 1 }
    ]), 
    registerUser
);

router.route("/login").post(loginUser)
router.route("/logout").post(userAuth, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)

module.exports = router;
