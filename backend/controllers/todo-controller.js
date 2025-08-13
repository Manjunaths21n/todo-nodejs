const {Todo} = require('../models/index.js');

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
}

export const createTodo = async (req, res) => { 
    const { todo, status, id } = req.body;

    if (!todo || !id) {
        return res.status(400).json({ message: 'Todo and ID are required' });
    }

    try {
        const _newTodo= await Todo.create({todo, status, id});
        res.status(201).json({success: 'Todo Created Successfully', todo: _newTodo});

        // const newTodo = new Todo({ todo, status, id });
        // await newTodo.save();
        // res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error });
    }
}

export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { todo, status } = req.body;

    if (!todo && !status) {
        return res.status(400).json({ message: 'Todo or status must be provided' });
    }

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(id, { todo, status }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ success: 'Todo Updated Successfully', todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo', error });
    }
}

export const deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json({ success: 'Todo Deleted Successfully', todo: deletedTodo });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error });
    }
}