const express = require("express");
const router = express.Router();
const adminController = require("../Controller/admin_controller");
const multer = require('multer');
const verifyToken = require("../middleware/verifytoken");
const verifyAuth = require('../middleware/verifyAuth');
const roleAccess = require('../middleware/roleAccess');


const request_param = multer();

const BlogImage = multer.diskStorage({
    destination:(req, filename, callback) => {
        callback(null, "./public/assets/Blog-post");
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g,"_"));
    }
});

const userImage = multer.diskStorage({
    destination:(req, filename, callback) => {
        callback(null, "./public/assets/user-profile");
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname.replace(/\s/g,"_"));
    }
});

const uploadBlogFiles = multer({storage: BlogImage});
const uploadUerFiles = multer({storage: userImage});



router.get("/", adminController.getHome);
router.all('/user/*', verifyToken);
router.get("/login", verifyAuth, adminController.getLogin);
router.get("/user/write", adminController.getWrite);
router.post("/users/login", request_param.any(), adminController.userLogin)
router.post("/users/register", request_param.any(), adminController.usersignup)
router.get("/user/logout", adminController.userLogout)
router.get("/user/profile", adminController.getProfile)
router.get("/user/mypost", adminController.getMypost)
router.post("/user/write", uploadBlogFiles.any(), adminController.writeUser)
router.post("/user/update/profile", uploadUerFiles.any(), adminController.updateUserProfile);
router.get("/user/edit/post/:id", adminController.getUpdateWrite);
router.post("/user/update/post", uploadBlogFiles.any(), adminController.updatePost)
router.get("/user/delete/post/:id", adminController.deletePost)


module.exports = {
    routers: router
};