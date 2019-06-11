import express from 'express';
import { router as urlShortenCtr } from '../../controllers/shortUrl';
import { router as authCtr } from '../../controllers/auth';


export const router = express.Router();

router.use('/shurl', urlShortenCtr);
router.use('/user', authCtr);