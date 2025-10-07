const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  getAllQuestions
} = require('../controllers/questionsController');
const protect = require('../middleware/authMiddleware');


// CRUD for questions
router.post('/',protect, createQuestion);
router.get('/:category',protect, getQuestions);
router.get('/',protect, getAllQuestions);
router.put('/:id',protect, updateQuestion);
router.delete('/:id',protect, deleteQuestion);

// CRUD for answers
router.post('/:id/answers', protect,addAnswer);
router.put('/:id/answers/:index',protect, updateAnswer);
router.delete('/:id/answers/:index',protect, deleteAnswer);

module.exports = router;
