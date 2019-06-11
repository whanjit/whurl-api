
import express from 'express';
import { router as v1ApiRouters } from './v1';

export const router = express.Router();
router.use('/v1', v1ApiRouters);