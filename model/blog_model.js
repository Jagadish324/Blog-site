const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title :{
       type: String,
       default:""
   },
   description:{
    type:String,
    default:""
  },
  blog_image:{
    type:String,
    default:""
},
   category:{
    type: String,
    default:""
   },
   userID:{
    type:String,
    required:true
   },
   username:{
    type:String,
    required:true
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
},
{
    timestamps:true,
    versionKey:false
});

module.exports = mongoose.model('bloguser',blogSchema);