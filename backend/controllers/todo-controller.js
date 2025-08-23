const { TodoModel } = require('../models/index.js');

const getTodos = async (req, res) => {
    try {
        const todos = await TodoModel.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
}

const createTodo = async (req, res) => {
    const { todo, status } = req.body;

    if (!todo) {
        return res.status(400).json({ message: 'Todo is required' });
    }

    try {
        const _newTodo = await TodoModel.create({ todo, status });
        res.status(201).json({ success: 'Todo Created Successfully', todo: _newTodo });

        // const newTodo = new Todo({ todo, status, id });
        // await newTodo.save();
        // res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error });
    }
}

const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { todo, status } = req.body;

    if (!todo && !status) {
        return res.status(400).json({ message: 'Todo or status must be provided' });
    }

    try {
        const updatedTodo = await TodoModel.findByIdAndUpdate(id, { todo, status }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ success: 'Todo Updated Successfully', todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error });
    }
}

const deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await TodoModel.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ success: 'Todo Deleted Successfully', todo: deletedTodo });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error });
    }
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};
