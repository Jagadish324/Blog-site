module.exports = (req, res, next) => {
    const token = req.session.token;
    if(token){
        return res.redirect("/")
    }else{
        next();
    }
};