// const http = require('http');
// const fs = require('fs');
// const path = require('path');



// http.createServer((req, res) => {
//     res.end('Hello, World!');

   
// }).listen(8888, () => {
//     console.log('Server running at http://localhost:8888/');
// });

const http = require('http');
const { parse } = require('url');

let todos = [];
let idCounter = 1;

// Utility to get request body as JSON
function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch (err) {
                reject(err);
            }
        });
    });
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;
    const method = req.method;

    // Enable CORS for testing in browser
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // GET /todos
    if (method === 'GET' && pathname === '/todos') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todos));
        return;
    }

    // GET /todos/:id
    if (method === 'GET' && /^\/todos\/\d+$/.test(pathname)) {
        const id = parseInt(pathname.split('/')[2]);
        const todo = todos.find(t => t.id === id);
        if (!todo) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Todo not found' }));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(todo));
        return;
    }

    // POST /todos
    if (method === 'POST' && pathname === '/todos') {
        try {
            const body = await getRequestBody(req);
            const newTodo = { id: idCounter++, ...body };
            todos.push(newTodo);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newTodo));
        } catch (err) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
        return;
    }

    // PUT /todos/:id
    if (method === 'PUT' && /^\/todos\/\d+$/.test(pathname)) {
        try {
            const id = parseInt(pathname.split('/')[2]);
            const index = todos.findIndex(t => t.id === id);
            if (index === -1) {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Todo not found' }));
                return;
            }
            const body = await getRequestBody(req);
            todos[index] = { id, ...body };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(todos[index]));
        } catch (err) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Invalid JSON' }));
        }
        return;
    }

    // DELETE /todos/:id
    if (method === 'DELETE' && /^\/todos\/\d+$/.test(pathname)) {
        const id = parseInt(pathname.split('/')[2]);
        const index = todos.findIndex(t => t.id === id);
        if (index === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Todo not found' }));
            return;
        }
        todos.splice(index, 1);
        res.writeHead(204);
        res.end();
        return;
    }

    // Not Found
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Route not found' }));
});

const PORT = 8888;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
