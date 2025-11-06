import axios from "axios";
import React, { useEffect, useState } from "react";
const axiosInstance = axios.create({baseURL:"http://localhost:3000/"})
export default function App() {
  const [todo, setTodo] = useState([]);
  const [task, setTask] = useState("");
  const [updatedTask, setUpdatedTask] = useState(null);

  const getAllTodo = async () => {
    await axiosInstance.get("/todos").then((res) => {
      if (Array.isArray(res.data.data)) {
        setTodo(res.data.data);
      }
    });
  };

  const updateTodo = async (id, payload) => {
    await axiosInstance
      .put(`${id}/update`, payload)
      .then(() => {
        getAllTodo();
      });
  };

  useEffect(() => {
    getAllTodo();
  }, []);

  const addTodo = async () => {
    if (!task) return;
    const res = await axiosInstance.post("create", { task });
    if (res.data.success) {
      setTodo([...todo, res.data.data]);
      getAllTodo();
      setTask("");
    } else {
      window.alert(res.data.message);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    addTodo();
  };

  const toggleTodo = (item) => {
    updateTodo(item._id, { ...item, status: !item.status });
  };

  const deleteTodo = (id) => {
    axiosInstance.delete(`${id}/delete`);
    setTodo(todo.filter((t) => t._id !== id));
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          padding: "10px",
          maxWidth: "450px",
          width: "100%",
          border: "2px solid white",
          borderRadius: "5px",
          textAlign: "center",
        }}
      >
        <h2>todo app</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            placeholder="Enter todo"
            style={{ padding: "5px" }}
            value={task}
            required
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit" style={{ margin: "10px" }}>
            Add
          </button>
        </form>
        <ul>
          {todo.map((item,index) => {
            return (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {updatedTask?._id === item._id ? (
                  <input
                    type="text"
                    value={updatedTask?.task}
                    onChange={(event) =>
                      setUpdatedTask({
                        ...updatedTask,
                        task: event.target.value,
                      })
                    }
                    onBlur={() =>
                      updateTodo(updatedTask._id, updatedTask).then(() => {
                        setUpdatedTask(null);
                      })
                    }
                  />
                ) : (
                  <span
                    style={{
                      textDecoration: item.status ? "line-through" : "none",
                      cursor: "pointer",
                      color: "white",
                      padding: "5px",
                    }}
                    onClick={() => toggleTodo(item)}
                  >
                    {item.task}
                  </span>
                )}
                <button
                  style={{ cursor: "pointer" }}
                  onClick={() => setUpdatedTask(item)}
                >
                  Update
                </button>
                <button onClick={() => deleteTodo(item._id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
