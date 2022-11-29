module.exports = (req, res, next) => {
    const user_info = req.session.user_info;
    if(user_info.role == "admin"){
        return next();
    }else{
       return res.redirect("/user/dashboard");
    }
};