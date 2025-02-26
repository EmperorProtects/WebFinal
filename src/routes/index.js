const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getUserProfile,
    updateUserProfile,
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require('../controllers');
const { authenticate } = require('../middleware');

router.post('/register', register);
router.post('/login', login);

router.get('/users/profile', authenticate, getUserProfile);
router.put('/users/profile', authenticate, updateUserProfile);

router.post('/tasks', authenticate, createTask);
router.get('/tasks', authenticate, getTasks);
router.get('/tasks/:id', authenticate, getTaskById);
router.put('/tasks/:id', authenticate, updateTask);
router.delete('/tasks/:id', authenticate, deleteTask);

module.exports = router;