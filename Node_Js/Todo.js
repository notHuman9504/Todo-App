const express = require('express');
const bodyParser = require('body-parser');
const path=require('path')
const fs =require('fs')
let unq=1
const app = express();
// !It will allow request form anywhere
const cors=require('cors')
app.use(cors())

function getIndex(todos,id){
    var i=0
    for(;i<todos.length;i++)
    {
       
        if(parseInt(id)==parseInt(todos[i].id))
        {
            break;
        }
    }
    return i
}
fs.readFile('Todo-id.json','utf-8',(err,data)=>
{
    if(err)throw err
    else unq=parseInt(JSON.parse(data).unq)
})


app.use(bodyParser.json())
app.get('/todos', (req, res) => {
    fs.readFile('./Todo.json','utf-8',(err,data)=>
    {
        if(err)throw err
        else res.send(JSON.parse(data))
    })
});

app.post('/todos',(req,res)=>{
    let obj={
        id:unq,
        task:req.body.task
    };
    unq++;
    let ob={
        unq:unq
    }
    fs.writeFile('./Todo-id.json',JSON.stringify(ob),(err)=>{
        if(err)throw err
    })
    fs.readFile('./Todo.json','utf-8',(err,data)=>
    {
        if(err)throw err
        var todos=JSON.parse(data)
        todos.push(obj)
        fs.writeFile('./Todo.json',JSON.stringify(todos),(err)=>{
            if(err)throw err
        })
        res.send(todos)
    })
}) 
app.delete('/todos/:id',(req,res)=>{
    let unqid=parseInt(req.params.id)
    fs.readFile('Todo.json','utf-8',(err,data)=>{
        if(err)throw err
        var todos=JSON.parse(data)
        let i=getIndex(todos,unqid);
        if(i!=todos.length)
        {
            todos.splice(i, 1);
            fs.writeFile('./Todo.json',JSON.stringify(todos),(err)=>{
                if(err)throw err
            })
            res.json(todos)
        }
        else
        {
            res.json(todos)
        }
        
    }) 
    
}) 
app.put('/todos/:id',(req,res)=>
{
    let unqid=parseInt(req.params.id)
    
    fs.readFile("Todo.json",'utf-8',(err,data)=>{
        if(err)throw err
        let todos=JSON.parse(data);
        let i=getIndex(todos,unqid);
        if(i!=todos.length)
        {
            let updatedtodo={
                id:unqid,
                task:req.body.task
            }
            todos[i]=updatedtodo;
            fs.writeFile('./Todo.json',JSON.stringify(todos),(err)=>{
                if(err)throw err;
            })
            res.json(todos)
        }
        else
        {
            req.json(todos);
        }
        

    })
})
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, '../Html/Todo.html'))
})
app.use(express.static(path.join(__dirname, '../')));
app.listen(3000)