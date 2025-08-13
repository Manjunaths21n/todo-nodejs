import mongoose from 'mongoose';

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
    id: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields


export const Todo = mongoose.model('Todo', TodoSchema);
// export default Todo;
