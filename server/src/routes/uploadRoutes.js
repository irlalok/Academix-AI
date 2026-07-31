import express from "express"
import { isTeacher, requireAuth } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { deleteAssignment, deleteDpp, deleteVideo, getAssignment, getDpp, getVideo, uploadAssignment, uploadDpp, uploadVideo } from "../controllers/uploadController.js";
const router=express.Router();
router.post('/videos',requireAuth,isTeacher,upload.single("video"),uploadVideo);
router.post('/assignments',requireAuth,isTeacher,upload.single('pdf'),uploadAssignment);
router.post('/dpp',requireAuth,isTeacher,upload.single('pdf'),uploadDpp);

router.get('/videos/:courseId',requireAuth,getVideo);
router.get('/assignments/:courseId',requireAuth,getAssignment);
router.get('/dpp/:courseId',requireAuth,getDpp);

router.delete("/videos/:id", requireAuth, isTeacher, deleteVideo);
router.delete("/assignments/:id", requireAuth, isTeacher, deleteAssignment);
router.delete("/dpp/:id", requireAuth, isTeacher, deleteDpp);

export default router