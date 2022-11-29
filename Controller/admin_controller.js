const userModel = require('../model/user_model');
const blogModel = require('../model/blog_model');
const jwt = require('jsonwebtoken');
const User = new userModel();
require('mongoose')
const Variable = require('../include/variable');


class adminController {
    async getHome(req, res) {
        try {
            let findData = await blogModel.find({
                "isDelete": false
            });
            console.log(findData, "++++findData+++++");
            res.render('main', {
                blog_dat: findData,
            })
        } catch (err) {
            throw err;
        }


    }
    async getLogin(req, res) {
        res.render('login')
    }
    async getWrite(req, res) {
        res.render('write')
    }


    async writeUser(req,res){
        try{
            const user_info = req.session.user_info;
            if (req.files.length > 0) {
                req.body.blog_image = req.files[0].filename;

                var blogform ={
                    "title": req.body.title,
                    "description": req.body.description,
                    "blog_image": req.body.blog_image,
                    "category" : req.body.category,
                    "userID": user_info._id,
                    "username": user_info.name
                };
            }else{
                var blogform ={
                    "title": req.body.title,
                    "description": req.body.description,
                    "category" : req.body.category,
                    "userID": user_info._id,
                    "username": user_info.name
                };
            }
            // console.log(blogform);
           let blogdata = await new blogModel(blogform);
           let saveblog = await blogdata.save();
           console.log(saveblog,"==saveblog==");

           res.redirect("/");
        }catch(err){
            throw err;
        }
    }

    async usersignup(req,res){
        try{
            const hashPassword = User.generateHash(req.body.password)

             let formData = {
                "name": req.body.fastname + " " + req.body.lastname,
                "email": req.body.email,
                "password": hashPassword
             };
             console.log(req.body,"==bodydata===");
             let userdata = await new userModel(formData);
             let saveuser = await userdata.save();
             console.log(saveuser,"---savedata---");

             res.redirect("/login");
        }catch(err){
            throw err;
        }
    }

    async userLogin(req, res) {
        try {
            console.log("try open");
            console.log(req.body);
            let userData = await userModel.findOne({
                "email": req.body.email,
                "isDeleted": false
            });
            console.log(userData);
            if (userData != null) {
                if (User.compareHash(req.body.password, userData.password) == true) {
                    let payload = {
                        "_id": userData._id,
                        "email": userData.email
                    };
                    console.log(payload);
                    let jwtToken = jwt.sign({
                        payload
                    }, process.env.SECRET_KEY, { expiresIn: 60 * 60 })
                    console.log(jwtToken);
                    req.session.token = jwtToken;
                    req.session.user_info = userData;
                    req.flash('success',Variable.loginSuccess);
                    res.redirect("/");
                } else {
                    console.log("Wrong password!");
                    req.flash('error',Variable.loginError);
                    res.redirect("/login")
                }
            } else {
                console.log("no data found");
                req.flash('error',Variable.userNotFound);
                res.redirect("/login");
            }
        } catch (error) {

        }
        // console.log("Hello");
    }

    async getProfile(req, res) {
        try {
            const user_info = req.session.user_info;

            let userData = await userModel.findOne({
                "_id": user_info._id
            });
            await res.render("profile", {
                page_title: "My Profile",
                page_name: "my-profile",
                profile_img: "thumb-card3.png",
                user_data: userData
            });
        } catch (error) {

        }
    }

    async updateUserProfile(req, res) {
        try{
            const user_info = req.session.user_info;
            if (req.files.length > 0) {
                req.body.profile_img = req.files[0].filename;

                var userform ={
                    "name": req.body.name,
                    "email": req.body.email,
                    "phone": req.body.phone,
                    "profile_image": req.body.profile_img,
                    
                };
            }else{
                var userform ={
                    "name": req.body.name,
                    "email": req.body.email,
                    "phone": req.body.phone,
                    
                };
            }
            // console.log(userform);
            let updateUser = await userModel.findByIdAndUpdate({
                "_id": user_info._id
            },userform);
        //    console.log(saveblog,"==saveblog==");

        res.redirect("/user/profile")
        }catch(err){
            throw err;
        }
    }

    async getMypost(req, res) {
        try {
            const user_info = req.session.user_info;

            if(user_info.role == 'admin'){
                var blogData = await blogModel.find({
                    "isDelete": false
                });
            }else{
                var blogData = await blogModel.find({
                    "userID": user_info._id
                });
            }
            console.log(blogData);
            await res.render("mypost", {
                page_title: "My Post",
                post_data: blogData,
                user_data: user_info
            });
        } catch (error) {

        }
    }

    async deletePost(req, res){
        try {
            const user_info = req.session.user_info;

            if(user_info.role == 'admin'){
                var deleteStatus = await blogModel.findByIdAndDelete({
                    "_id": req.params.id
                });
                res.redirect("/user/mypost")
            }else{
                var postData = await blogModel.find({
                    "_id": req.params.id
                });
                if(user_info._id == postData.userID){
                    var deleteStatus = await blogModel.findByIdAndDelete({
                        "_id": req.params.id
                    });
                    res.redirect("/user/mypost")
                }else{
                    res.write("Unauthorize access");
                }
            }
        } catch (error) {
            
        }
    }


    async getUpdateWrite(req, res) {
        try {
            const user_info = req.session.user_info;

            let postData = await blogModel.findOne({
                "_id": req.params.id
            });
            if(postData.userID == user_info._id){
                await res.render("updatepost", {
                    page_title: "Update Post",
                    post_data: postData
                });
            }else{
                res.write("Unauthorize");
            }
        } catch (error) {

        }
    }

    async userLogout(req, res) {
        try {
            req.session.destroy();
            res.redirect("/");
        } catch (error) {
            throw error;
        }
    }

    async updatePost(req,res){
        try{
            const user_info = req.session.user_info;
            if (req.files.length > 0) {
                req.body.blog_image = req.files[0].filename;

                var blogform ={
                    "title": req.body.title,
                    "description": req.body.description,
                    "blog_image": req.body.blog_image,
                    "category" : req.body.category,
                    "username": user_info.name
                };
            }else{
                var blogform ={
                    "title": req.body.title,
                    "description": req.body.description,
                    "category" : req.body.category,
                    "username": user_info.name
                };
            }
            // console.log(blogform);
            let updateUser = await blogModel.findByIdAndUpdate({
                "_id": req.body.postId
            },blogform);
        //    console.log(saveblog,"==saveblog==");

           res.redirect("/user/mypost");
        }catch(err){
            throw err;
        }
    }
}

module.exports = new adminController();