const {findAll, findById} = require("../models/todo.models")
const todoFile= require("../db/todo.json")
const fs = require("fs")

const getTodos = async (req, res)=>{
    res.writeHead(200, {"Content-Type":"application/json"} )
    try {
        const todos = await findAll()
        res.end(JSON.stringify(todos));
    } catch (error) {
        console.log(error)
    }
}

const getTodoById= async (req, res, id)=>{
    res.writeHead(200, {"Content-Type":"application/json"} )
    try {
        const todoId =parseInt(id);
        const todo = await findById(todoId)
        if (!todo){
            res.writeHead(404, {"Content-Type":"application/json"} )
            res.end(JSON.stringify({message:"Todo with id not found"}));
        }
        res.end(JSON.stringify(todo));
    } catch (error) {
        console.log(error)
    }
}

const AddToDO= async (req, res)=>{

    try {
        let body =""
        req.on('data', (chunk)=>{
            body += chunk.toString();
        });
        
        req.on("end", async()=>{
            const todoData = JSON.parse(body);
            const todos = await findAll()
            const newTodo = {...todoData, id:todos.length +1};
            todos.push(newTodo);

            fs.writeFile("./db/todo.json", JSON.stringify(todos,null, 2), (err)=>{
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to add todo' }));
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newTodo));
                }
            })
        })
    } catch (error) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

const UpdateToDOById= async (req, res, id)=>{

    try {
        let body =""
        req.on('data', (chunk)=>{
            body += chunk.toString();
        });
        
        req.on("end", async()=>{
            const todoData = JSON.parse(body);
            const todos = await findAll()
            const index = todos.findIndex(todo => todo.id === parseInt(id)); // if the todo does not exit, index is -1

            if (index === -1){
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Todo not found' }));
            }else{
                todos[index]= {...todos[index], ...todoData}
            }
            fs.writeFile('./db/todo.json', JSON.stringify(todos, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to update todo' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(todos[index]));
                }
            });
        })
    } catch (error) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

const DeleteToDOById= async (req, res, id)=>{

    try {

        const todos = await findAll()
        const index = todos.findIndex(todo => todo.id === parseInt(id)); // if the todo does not exit, index is -1

        if (index === -1){
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Todo not found' }));
        }else{
            todos.splice(index, 1);
        }
        fs.writeFile('./db/todo.json', JSON.stringify(todos, null, 2), (err) => {
            if (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to update todo' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Todo deleted successfully' }));
            }
            });
    } catch (error) {
        console.log(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
}
module.exports ={
    getTodos,
    getTodoById,
    AddToDO,
    UpdateToDOById,
    DeleteToDOById
}