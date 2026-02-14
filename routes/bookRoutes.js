import express from 'express'
const router = express.Router();

import { addBook, deleteBook, showBookId, showBooks, editBook } from '../controllers/bookController.js'
import authenticateToken  from '../middlewares/auth.js';



router.get('/', authenticateToken, showBooks);
router.get('/:id', authenticateToken, showBookId);
router.post('/', authenticateToken, addBook);
router.put('/:id', authenticateToken, editBook);
router.delete('/:id', authenticateToken, deleteBook);

export default router;




