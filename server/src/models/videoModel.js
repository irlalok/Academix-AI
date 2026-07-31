import mongoose from "mongoose"
const videoSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  videoUrl:{
    type:String,
    required:true
  },
  publicId: {
    type: String,
    required: true
  },
  thumbnail:{
    type:String,
  },
  duration:{
    type:Number,
    required:true
  },
  teacherId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Teacher",
    required:true,
  },
  courseId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Course",
    required:true,
  }},{timestamps: true})

const videoModel=mongoose.model('Video',videoSchema);
export default videoModel;