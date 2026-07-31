import express from "express";
import {requireAuth,isTeacher} from "../middleware/auth.js"

const router=express.Router();
router.post("/",requireAuth,isTeacher,createLive);
router.get('/:courseId',requireAuth,getLiveClass);
router.patch('/:id/start',requireAuth,isTeacher,startLiveClass);
router.patch('/:id/end',requireAuth,isTeacher,endLiveClass);

export default router;