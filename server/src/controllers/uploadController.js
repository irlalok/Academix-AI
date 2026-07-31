import videoModel from "../models/videoModel.js";
import cloudinary from "../utils/cloudinary.js";
import assignmentModel from "../models/assignmentModel.js"
import Teachermodel from "../models/teacherModel.js";
import coursesModel from "../models/coursesModel.js";
import dppModel from "../models/dppModel.js";

export const uploadVideo=async(req,res)=>{
  try {
  const file=req.file;
  if(!file)return res.status(404).json({message:"File not found"});
  const {title,description,courseId,duration}=req.body;
  if (!title || !courseId) {
    return res.status(400).json({
        message: "Missing required fields"
    });}
  const teacher = await Teachermodel.findOne({userId:req.user._id});
    if(!teacher) {
      return res.status(404).json({message: "Teacher not found"});}
  const Course=await coursesModel.findById(courseId);
    if (!Course) {
    return res.status(404).json({message: "Course not found"});}
    if(!teacher.institutionId.equals(Course.institutionId)) {
    return res.status(403).json({message:"Forbidden"});}
  const result = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
      {
          resource_type: "video",
          folder:"Videos"
      },
        (error, result) => {
            if (error) return reject(error);
                resolve(result);
          }
          );
            stream.end(req.file.buffer);
        });
  const video=await videoModel.create({
    title,
    description,
    courseId,
    publicId:result.public_id,
    teacherId:teacher._id,
    videoUrl: result.secure_url,
    thumbnail: '',
    duration
  })
  return res.status(201).json({
    message:"video uploaded",
    video: video
  })

  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

export const uploadAssignment=async(req,res)=>{
  try {
  if(!req.file)return res.status(404).json({message:"File not found"});
  const {title,description,courseId,deadline}=req.body;
  if (!title || !courseId ||!deadline) 
    {return res.status(400).json({message: "Missing required fields"});}
  const teacher = await Teachermodel.findOne({userId:req.user._id});
  if(!teacher) {
    return res.status(404).json({message: "Teacher not found"});}
  const Course=await coursesModel.findById(courseId);
  if (!Course) {
    return res.status(404).json({message: "Course not found"});}
  if(!teacher.institutionId.equals(Course.institutionId)) {
    return res.status(403).json({message:"Forbidden"});}
  const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({resource_type: "raw",folder:"assignments"},(error, result) => {
              if (error) return reject(error);
            resolve(result);}
          );
            stream.end(req.file.buffer);
        });
  const assignment=await assignmentModel.create({
    title,description,pdfUrl:result.secure_url,publicId:result.public_id,courseId,teacherId:teacher._id,deadline
  })
  return res.status(201).json({message:"Uploaded",assignment:assignment})
  } catch (error) {
    return res.status(500).json({message:"server error"})
  }
}

export const uploadDpp=async(req,res)=>{
  try {
  if(!req.file)return res.status(404).json({message:"File not found"});
  const {title,description,courseId}=req.body;
  if (!title || !courseId) 
    {return res.status(400).json({message: "Missing required fields"});}
  const teacher = await Teachermodel.findOne({userId:req.user._id});
  if(!teacher) {
    return res.status(404).json({message: "Teacher not found"});}
  const Course=await coursesModel.findById(courseId);
  if (!Course) {
    return res.status(404).json({message: "Course not found"});}
  if(!teacher.institutionId.equals(Course.institutionId)) {
    return res.status(403).json({message:"Forbidden"});}
  const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({resource_type: "raw",folder:"Dpps"},(error, result) => {
              if (error) return reject(error);
            resolve(result);}
          );
            stream.end(req.file.buffer);
        });
  const Dpp=await dppModel.create({
    title,description,pdfUrl:result.secure_url,publicId:result.public_id,courseId,teacherId:teacher._id
  })
  return res.status(201).json({message:"Uploaded",Dpp:Dpp})
  } catch (error) {
    return res.status(500).json({message:error.message})
  }
}

export const getVideo=async(req,res)=>{
  try {
  const course=await coursesModel.findById(req.params.courseId);
  if(!course)return res.status(404).json({message:"Course Not Found"});
  const videos=await videoModel.find({courseId:course._id}).populate("teacherId", "name");
  if(videos.length===0)return res.status(404).json({message:"video Not Found"});
  return res.status(200).json({success: true, videos});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

export const getAssignment=async(req,res)=>{
  try {
  const courseId=req.params.courseId;
  const course=await coursesModel.findById(courseId);
  if(!course)return res.status(404).json({message:"Course Not Found"});
  const assignments=await assignmentModel.find({courseId:courseId}).populate("teacherId","name");
  if(assignments.length===0)return res.status(404).json({message:"assignment not found"});
  return res.status(200).json({success:true,assignments});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

export const getDpp=async(req,res)=>{
  try {
  const courseId=req.params.courseId;
  const course=await coursesModel.findById(courseId);
  if(!course)return res.status(404).json({message:"Course Not Found"});
  const dpps=await dppModel.find({courseId:courseId}).populate("teacherId","name");
  if(dpps.length===0)return res.status(404).json({message:"No Dpps found"});
  return res.status(200).json({success:true,dpps});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

export const deleteVideo=async(req,res)=>{
  try {
  const videoId=req.params.id;
  const video=await videoModel.findById(videoId);
  if(!video)return res.status(404).json({message:"Video not found"});
  const teacher = await Teachermodel.findOne({ userId: req.user._id });
  if(!teacher||!video.teacherId.equals(teacher._id))return res.status(403).json({message:"unauthorized"});
  await cloudinary.uploader.destroy(video.publicId, {resource_type: "video"});
  await videoModel.findByIdAndDelete(videoId);
   return res.status(200).json({message:"successfully deleted"});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

export const deleteAssignment=async(req,res)=>{
  try {
  const assignment=await assignmentModel.findById(req.params.id);
  if(!assignment)return res.status(404).json({message:"Assignment not found"});
  const teacher=await Teachermodel.findOne({userId:req.user._id});
  if(!teacher)return res.status(404).json({message:"Teacher not found"});
  if(!assignment.teacherId.equals(teacher._id))return res.status(403).json({message:"Unauthorized"});
  await cloudinary.uploader.destroy(assignment.publicId,{resource_type:'raw'})
  await assignmentModel.findByIdAndDelete(assignment._id);
  return res.status(200).json({message: "Assignment deleted successfully"});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}

export const deleteDpp=async(req,res)=>{
  try {
  const Dpp=await dppModel.findById(req.params.id);
  if(!Dpp)return res.status(404).json({message:"Dpp not found"});
  const teacher=await Teachermodel.findOne({userId:req.user._id});
  if(!teacher)return res.status(404).json({message:"Teacher not found"});
  if(!Dpp.teacherId.equals(teacher._id))return res.status(403).json({message:"Unauthorized"});
  await cloudinary.uploader.destroy(Dpp.publicId,{resource_type:'raw'})
  await dppModel.findByIdAndDelete(Dpp._id);
  return res.status(200).json({message: "Dpp deleted successfully"});
  } catch (error) {
    return res.status(500).json({message:error.message});
  }
}