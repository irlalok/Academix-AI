import teachermodel from "../models/teacherModel.js"
import coursemodel from "../models/coursesModel.js"
import livemodel from "../models/liveclassModel.js"
import studentmodel from "../models/studentModel.js"
import crypto from "crypto";

export const createLive=async(req,res)=>{
  try {
    const {title,courseId,scheduledTime}=req.body;
    if(!title || !courseId || !scheduledTime){return res.status(400).json({
        success:false,
        message:"All fields are required."
    });
    }
    const teacher=await teachermodel.findOne({userId:req.user._id});
    if(!teacher)return res.status(404).json({message:"Teacher not found"});
    const course=await coursemodel.findById(courseId);
    if(!course)return res.status(404).json({message:"Course not found"});
    if(!teacher.institutionId.equals(course.institutionId)) return res.status(403).json({message:"Forbidden"});
    const roomId = crypto.randomUUID();
    const liveClass = await livemodel.create({
            title,
            courseId,
            teacherId: teacher._id,
            roomId,
            scheduledTime,
        });
    return res.status(201).json({success:true,message:"Live class created successfully",liveClass})
  } catch (error) {
    return res.status(500).json({message:"Internal server error"});
  }
}

export const getLiveClass=async(req,res)=>{
  try {
  const student = await studentmodel.findOne({userId: req.user._id});
  if(!student)return res.status(404).json({message:"Student not found"})
  const courseId=req.params.courseId;
  const course=await coursemodel.findById(courseId);
  if(!course) return res.status(404).json({message:"Course not found"});
  const enrolled = course.students.some(id =>id.equals(student._id));
  if (!enrolled) {
    return res.status(403).json({
        message: "You are not enrolled in this course."
    })}
  const liveClasses=await livemodel.find({courseId, status: { $ne: "ended" }}).populate("teacherId","name");
  return res.status(200).json({liveClasses})
  } catch (error) {
    return res.status(500).json({message:"server error"});
  }
}

export const startLiveClass=async(req,res)=>{
  try {
  const Liveclass=await livemodel.findById(req.params.id);
  if(!Liveclass)return res.status(404).json({message:"Live class not found"});
  const teacher = await teachermodel.findOne({userId: req.user._id});
  if(!teacher)return res.status(404).json({message:"Teacher not found"});
  if(!Liveclass.teacherId.equals(teacher._id))return res.status(403).json({message:"Forbidden"});
  if (Liveclass.status !== "scheduled") {
    return res.status(400).json({
        message: "Live class cannot be started."
    });
}
  Liveclass.status="live"
  Liveclass.startedAt=new Date();
  await Liveclass.save();
  return res.status(200).json({message:"Live class started"});
  } catch (error) {
    return res.status(500).json({message:"server error"});
  }
}

export const endLiveClass=async(req,res)=>{
  try {
  const Liveclass=await livemodel.findById(req.params.id);
  if(!Liveclass)return res.status(404).json({message:"Live class not found"});
  const teacher = await teachermodel.findOne({userId: req.user._id});
  if(!teacher)return res.status(404).json({message:"Teacher not found"});
  if(!Liveclass.teacherId.equals(teacher._id))return res.status(403).json({message:"Forbidden"});
  if (Liveclass.status !== "live") {
    return res.status(400).json({
        message: "Only a live class can be ended."
    });
}
  Liveclass.status="ended"
  Liveclass.endedAt=new Date();
  await Liveclass.save();
  return res.status(200).json({message:"Live class ended"});
  } catch (error) {
    return res.status(500).json({message:"server error"});
  }
}