const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    todo: {
        type: String,
        trim: true, // Ensures no leading/trailing spaces
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'], // Only allows these values
        default: 'todo', // Default state is 'todo'
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields


const TodoModel = mongoose.model('Todo', TodoSchema);
module.exports = { TodoModel };
