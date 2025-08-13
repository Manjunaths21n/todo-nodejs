// export * from './todo-controller.js';
const { createTodo, deleteTodo, getTodos, updateTodo } = require('./todo-controller.js');


module.exports = {
    createTodo,
    deleteTodo,
    getTodos,
    updateTodo
}
