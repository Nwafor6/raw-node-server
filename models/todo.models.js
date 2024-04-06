const todos = require("../db/todo.json");



function findAll(){
    return new Promise ((resolve, reject)=>{
        resolve(todos)
    })
}

function findById(id) {

    return new Promise((resolve, reject) => {
        const singleTodo = todos.find((p) => p.id === id);
        resolve(singleTodo);
    });
}

// async function create(data){
//     return new Promise(async(resolve, reject)=>{
//         const newTodo = await addToDb(data)
//     })
// }


module.exports ={
    findAll,
    findById
}