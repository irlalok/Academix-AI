import mongoose from "mongoose";
const liveclassSchema=new mongoose.Schema({
  title:{type:String,required:true},
  courseId:{type:mongoose.Schema.Types.ObjectId,ref:'Course',required:true},
  teacherId:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher',required:true},
  roomId:{type:String,required:true},
  scheduledTime:{type:Date,required:true},
  status:{type:String,enum:['Pending','Started','Completed'],default:"Pending"},
  startedAt:{type:Date},
  endedAt:{type:Date},
  recordingUrl: {type: String}},{timestamps:true})
const liveClassModel=new mongoose.model("Liveclass",liveclassSchema);
export default liveClassModel