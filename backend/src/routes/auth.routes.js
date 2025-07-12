import express from 'express';
import { checkAuth, login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)

router.put('/update-profile',protectRoute, updateProfile)

/*this route will be used to check whether user is logged in or not
since token is stored in http only cookies therefore from frontend side 
there is no automatic way of knowing if user is logged in or not when we
refresh the page */
router.get('/check', protectRoute, checkAuth)

export default router;
