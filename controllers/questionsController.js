const Question = require('../models/Questions');

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { category, question } = req.body;
    if (!category || !question) {
      return res.status(400).json({ success: false, message: 'Category and question are required' });
    }

    const newQuestion = new Question({ category, question });
    await newQuestion.save();
    res.json({ success: true, data: newQuestion, message: 'Question created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all questions by category
const getQuestions = async (req, res) => {
  try {
    const { category } = req.params;
    const questions = await Question.find({ category });
    res.json({ success: true, data: questions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all questions grouped by category
const getAllQuestions = async (req, res) => {
  try {
    // Fetch all questions at once
    const questions = await Question.find();

    // Group questions by category
    const grouped = {
      packageSuppliers: [],
      rawSuppliers: [],
      packageFAQs: [],
      rawFAQs: []
    };

    questions.forEach(q => {
      if (grouped[q.category]) {
        grouped[q.category].push(q);
      }
    });

    res.json({ success: true, data: grouped });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update question text
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Question text is required' });
    }

    const updated = await Question.findByIdAndUpdate(id, { question }, { new: true });
    res.json({ success: true, data: updated, message: 'Question updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    await Question.findByIdAndDelete(id);
    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add an answer
const addAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ success: false, message: 'Answer is required' });

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    question.answers.push(answer);
    await question.save();
    res.json({ success: true, data: question, message: 'Answer added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an answer
const updateAnswer = async (req, res) => {
  try {
    const { id, index } = req.params;
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ success: false, message: 'Answer is required' });

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    if (index < 0 || index >= question.answers.length) {
      return res.status(400).json({ success: false, message: 'Invalid answer index' });
    }

    question.answers[index] = answer;
    await question.save();
    res.json({ success: true, data: question, message: 'Answer updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an answer
const deleteAnswer = async (req, res) => {
  try {
    const { id, index } = req.params;

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    if (index < 0 || index >= question.answers.length) {
      return res.status(400).json({ success: false, message: 'Invalid answer index' });
    }

    question.answers.splice(index, 1);
    await question.save();
    res.json({ success: true, data: question, message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  getAllQuestions
};
