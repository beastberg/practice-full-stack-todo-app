import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./taskPage.css"
import axios from "axios";

const TaskPage = () => {
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);
   
  const token = localStorage.getItem("token");

  useEffect(() => {
    
    const fetchTask = async () => {
      setLoading(true);

      const localTask = localStorage.getItem("tasks");
      if (localTask) {
        setTask(JSON.parse(localTask));
      }

      try {
        const response = await fetch("http://localhost:4000/task/getTask", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          const taskArray = Array.isArray(data) ? data : [];
          setTask(taskArray);

          // Save to local storage
          localStorage.setItem("tasks", JSON.stringify(taskArray));
        } else {
          const errorData = await response.json();
          setError(errorData.message || "An error occurred");
        }
      } catch (err) {
        setError("Failed to fetch your tasks");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [token]);

  const deleteThis = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:4000/task/deleteTask/${id}`, { // Use backticks
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
  
      if (response.data) {
        setTask((prevTask) => prevTask.filter((task) => task._id !== id));
        alert("Task deleted successfully");
      } else {
        alert("An error occurred while deleting the task");
      }
    } catch (error) {
      console.error("Error deleting task:", error.message);
      alert("An error occurred while deleting the task");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !msg.trim()) {
      alert("Both title and message are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/task/postTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, msg }),
      });

      if (response.ok) {
        const latestTask = await response.json();
        setTask((prevTask) => {
          const updatedTask = [...prevTask, latestTask];
          localStorage.setItem("tasks", JSON.stringify(updatedTask));
          return updatedTask;
        });
        setTitle("");
        setMsg("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred while submitting");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit your task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="main">
      <h1>Daily Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
        <button type="submit">Add Task</button>
      </form>
      {loading ? (
        <p>Loading tasks...</p>
      ) : task.length > 0 ? (
        task.map((item, index) => (
          <div className="task" key={index}>
            <h2>{item.title}</h2>
            <p>{item.msg}</p>
             <button onClick={()=>deleteThis(item._id)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No tasks available</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TaskPage;
