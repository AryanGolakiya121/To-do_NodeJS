import express from "express";
import { editTodoValidator, todoValidator, updateTodoStatusValidator } from "../../validators/todoValidator.js";
import { addTodo, deleteTodo, getAllTodos, getTodo, updateTodo, updateTodoStatus } from "../../controllers/todoController.js";

const router = express.Router();

router.post("/add", todoValidator(), addTodo)
router.get("/get/all", getAllTodos)
router.get("/get/:id", getTodo)
router.put("/edit/:id", editTodoValidator(), updateTodo)
router.patch("/edit/status/:id", updateTodoStatusValidator(), updateTodoStatus)
router.delete("/delete/:id", deleteTodo)

export default router;