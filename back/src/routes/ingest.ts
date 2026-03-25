import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/upload', authMiddleware, async (req: Request, res: Response) => {
  // Placeholder for document ingestion logic
  res.json({ message: 'Ingestion endpoint' });
});

export default router;
