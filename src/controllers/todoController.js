import Todo from "../models/todoModel.js";
import User from "../models/userModel.js";

export const addTodo = async(req, res) => {
    try{
        const { title, status } = req.body;
        const userId = req.user.id


        // const checkTodo = await Todo.findOne({title: title})

        // if(checkTodo){
        //     return res.status(400).json({status: false, message: "To-do already exists"})
        // }

        await Todo.create({title, status, userId})

        res.status(200).json({status: true, message: "To-do added succeffully!"})

    }catch(error){
        console.log("Error while adding new todo: ",error);
        res.status(500).json({status: false, message: "Internal server error while adding to-do ", error:error})
    }
}

export const getAllTodos = async(req, res) => {
    try{
        const todos = await Todo.findAll({ attributes: ['id', 'title', 'status'], include: {model: User, attributes:['email']},},)

        if(!todos || todos.length === 0){
            return res.status(404).json({status: false, message: "Not any to-do exists"})
        }

        res.status(200).json({status: true, message: "To-do fetch successfully", Todos: todos})
    }catch(error){
        console.log("Error while fetching todos: ",error);
        res.status(500).json({status: false, message: "Internal server error while fetchng to-dos", error: error})
    }
}

export const getTodo = async(req, res) => {
    try{

        const id = req.params.id;

        const todo = await Todo.findByPk(id, { attributes: ['id', 'title', 'status'], include: { model: User, attributes:['email']}})

        if(!todo){
            return res.status(404).json({status: false, message: "To-do not found"})
        }

        res.status(200).json({status: true, message: "To-do fetch successfully", todo: todo})
    }catch(error){
        console.log("Error while fetching todo: ",error);
        res.status(500).json({status: false, message: "Internal server error while fetching to-dos", error: error})
    }
}


export const updateTodo = async(req, res) => {
    try{
        const todoId = req.params.id;
        const { title, status } = req.body;
   
        const [updated] = await Todo.update({title, status}, { where: { id: todoId }})

        if(!updated){
            return res.status(404).json({status: false, message: 'Todo not found' });
        } 

        res.status(200).json({status: true, message: 'To-do updated successfully' })

    }catch(error){
        console.log('Internals error while updaing todo: ',error);
        res.status(500).json({status: false, message: "Internals error while updaing todo", error:error.message})
    }
}

export const updateTodoStatus = async(req, res) => {
    try{
        const todoId = req.params.id;

        const { status } = req.body;

        const [ update ] = await Todo.update({status: status}, { where: { id: todoId }})

        if(!update){
            return res.status(404).json({ status: false, message: 'Todo not found' });
        }

        res.status(200).json({ status: true, message: "To-do status updated successfully" })

    }catch(error){
        console.log("Error while updating to-do status: ",error);
        res.status(500).json({status: false, message: "Internal error whilw updating to-do status", error: error})
    }
}

export const deleteTodo = async(req, res) => {
    try{
        const todoId = req.params.id;

        const deleteTodo = await Todo.destroy({ where: { id: todoId }})

        if(!deleteTodo){
            return res.status(404).json({status: false, message: 'To-do not found' });
        }
        
        res.status(200).json({ status: true, message: "To-do deleted successfully" })

    }catch(error){
        console.log("Error while deleting to-do: ",error);
        res.status(500).json({status: false, message: "Internal error whilw deleting to-do", error: error})
    }
}