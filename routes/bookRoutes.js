import express from 'express'
const router = express.Router();

import { addBook, deleteBook, showBookId, showBooks,editBook  } from '../controllers/bookController.js'


router.get('/', showBooks);
router.get('/:id', showBookId);
router.post('/', addBook);
router.put('/:id', editBook);
router.delete('/:id', deleteBook);

export default router;




