import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema({
    title: {type:String,required:true},
    description: String,
    pdfUrl:{type:String,required:true},
    publicId: {
    type: String,
    required: true
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    deadline:{type:String,required:true},

},{timestamps:true});

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);
export default AssignmentModel;