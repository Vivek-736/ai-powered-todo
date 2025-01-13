"use client";
import { useState, useEffect } from "react";
import { CopilotPopup } from "@copilotkit/react-ui";
import { useCopilotAction } from "@copilotkit/react-core"; 

export default function Home() {
  const [todos, setTodos] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
 
  useCopilotAction({
    name: "addTodoItem",
    description: "Add a new todo item to the list",
    parameters: [
      {
        name: "todoText",
        type: "string",
        description: "The text of the todo item to add",
        required: true,
      },
    ],
    handler: async ({ todoText }) => {
      const newTodo = { id: Date.now(), text: todoText, completed: false };
      setTodos([...todos, newTodo]);
    },
  });

  useEffect(() => {
    const todoString = localStorage.getItem("todos");
    if (todoString) {
      setTodos(JSON.parse(todoString));
    }
  }, []);

  const updateTodos = (updatedTodos: { id: number; text: string; completed: boolean }[]) => {
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const addTodo = () => {
    if (input.trim() === "") return;

    if (editId !== null) {
      const updatedTodos = todos.map((todo) =>
        todo.id === editId ? { ...todo, text: input } : todo
      );
      updateTodos(updatedTodos);
      setEditId(null);
    } else {
      const newTodo = { id: Date.now(), text: input, completed: false };
      updateTodos([...todos, newTodo]);
    }
    setInput("");
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    updateTodos(updatedTodos);
  };

  const editTodo = (id: number) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    if (todoToEdit) {
      setInput(todoToEdit.text);
      setEditId(id);
    }
  };

  const toggleComplete = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    updateTodos(updatedTodos);
  };

  return (
    <div className="min-h-screen bg-blue-200">
      <nav className="bg-gradient-to-r from-violet-500 to-blue-500 p-4">
        <h1 className="text-white text-2xl font-bold text-center">VTodo</h1>
      </nav>

      <main className="p-4 max-w-2xl mx-auto mt-5">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new todo"
            className="flex-1 p-2 rounded-lg text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addTodo}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            {editId !== null ? "Update" : "Add"}
          </button>
        </div>

        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex justify-between items-center bg-white p-3 rounded-lg shadow"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="h-5 w-5 text-blue-600 rounded"
                />
                <span
                  className={`text-gray-700 overflow-y-auto max-h-20 ${todo.completed ? "line-through text-gray-400" : ""
                    }`}
                >
                  {todo.text}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => editTodo(todo.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <CopilotPopup
          instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
          labels={{
            title: "Popup Assistant",
            initial: "Need any help?",
          }}
        />
      </main>
    </div>
  );
}