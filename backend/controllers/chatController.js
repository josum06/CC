const Message = require('../models/Message');
const { requireAuth } = require('@clerk/clerk-sdk-node'); // Adjust if you're using your own middleware

// Get messages between two users
exports.getChats = async (req, res) => {
  try {
    const recipientId = req.params.id;
    const senderId = req.query.senderId;
    console.log('Sender ID:', senderId);
    console.log('Recipient ID:', recipientId);

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: senderId, recipient: senderId },
      ],
    }).populate('sender recipient');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send a message
exports.createChat = async (req, res) => {
  const { recipientId, content ,userId} = req.body;

  try {
    const message = new Message({
      sender: userId,
      recipient: recipientId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

