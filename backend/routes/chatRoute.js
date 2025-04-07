const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { createChat, getChats } = require('../controllers/chatController');


router.get('/chats/:id', getChats);
router.post('/chats', createChat);

module.exports = router;