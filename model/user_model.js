const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

var userSchema = new Schema({
    name:{
        type:String,
        required:true,
        default: ""
    },
    email:{
        type:String,
        required:true,
        default: ""
    },
    phone:{
        type:String,
        default: ""
    },
    password: {
        type:String,
        
    },
    role :{
        type:String,
        enum: ["user","customer","admin"],
        default: "user"
    },
    profile_image:{
        type:String,
        default:"avatar.png"
    },
    status:{
        type:Boolean,
        default:true,
        enum:[true,false]
    },
    isDelete:{
        type:Boolean,
        default:false,
        enum:[true,false]
    }
    
},{
    timestamps:true,
    versionKey:false
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(12));
}

userSchema.methods.compareHash = function(password, hashPassword) {
    return bcrypt.compareSync(password, hashPassword);
}
module.exports = mongoose.model('appuser',userSchema);