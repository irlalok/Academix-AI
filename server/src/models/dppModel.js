import mongoose from "mongoose";
const dppSchema=new mongoose.Schema({
  title:{type:String,required:true},
  description:{type: String},
  pdfUrl:{type:String,required:true},
  publicId: {type: String,required: true},
  teacherId:{type:mongoose.Schema.Types.ObjectId,ref: "Teacher",required:true},
  courseId:{type:mongoose.Schema.Types.ObjectId,ref: "Course",required:true},
  createdAt:{type:Date,default:Date.now},
})

const dppModel=new mongoose.model("Dpp",dppSchema);
export default dppModel;