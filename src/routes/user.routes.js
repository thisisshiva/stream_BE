const express = require("express");
const {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetials,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} = require("../controllers/user.controller");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const userAuth = require("../middlewares/auth.middleware");

router.route("/register").post(
  upload.fields([
    //we are accepting two files
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(userAuth, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(userAuth, changeCurrentPassword);
router.route("/current-user").get(getCurrentUser);
router.route("/update-account").patch(userAuth, updateAccountDetials);
router
  .route("/avatar")
  .patch(userAuth, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(userAuth, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(userAuth, getUserChannelProfile);
router.route("/history").get(userAuth, getWatchHistory);

module.exports = router;
