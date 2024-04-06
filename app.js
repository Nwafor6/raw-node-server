const http = require("http")
const dotenv = require("dotenv")
const {getTodos,getTodoById, AddToDO, UpdateToDOById, DeleteToDOById} = require("./controllers/todo.controller")


dotenv.config()

const {PORT} = process.env

// create the server
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    if (req.url === "/" && req.method === "GET") {
        const responseData = { message: 'Hello Node.' };
        res.end(JSON.stringify(responseData));
    } else if (req.url === "/get-todos") {
        getTodos(req, res);
    } else if (req.url.match(/\/get-todo\/([0-9]+)/) && req.method === "GET") { // Corrected regex pattern
        const id = req.url.split('/')[2];
        getTodoById(req, res, id);
    }else if (req.url === "/add-todo" && req.method === "POST"){
        AddToDO(req,res)
    }else if (req.url.match(/\/update-todo\/([0-9]+)/) && req.method === "PUT"){
        const id = req.url.split('/')[2];
        UpdateToDOById(req, res, id)
    }else if (req.url.match(/\/delete-todo\/([0-9]+)/) && req.method === "DELETE"){
        const id = req.url.split('/')[2];
        DeleteToDOById(req, res, id)
    }else{
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({message:"invalid endpoint"}));
    }
});


// start the server and listen to a port
server.listen(PORT, ()=>{
    console.log(`Server runing on ${PORT}`)
})

