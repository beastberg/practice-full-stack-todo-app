import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskPage = () => {
  const [task, setTask] = useState([]);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Check if user is logged in
  const token = localStorage.getItem("token");
  if (!token) {
    return (
      <div>
        <h1>If you are a new user, please register or login</h1>
        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>
      </div>
    );
  }

  // Fetch tasks
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:4000/task/getTask", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            "x-auth-token": token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTask(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch tasks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [token]);

  // Submit new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !msg.trim()) {
      alert("Title and message are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/task/postTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, // Fix typo here
        },
        body: JSON.stringify({ title, msg }),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTask((prevTask) => [...prevTask, newTask]);
        setTitle("");
        setMsg("");
      } else {
        const errorData = await response.json();
        console.log(errorData.msg || "Failed to add task. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the task:", error);
      alert("An error occurred while submitting the task.");
    }
  };

  return (
    <div className="main">
      <h1>Daily Task</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter the title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter your msg"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      {loading ? (
        <p>Loading tasks...</p>
      ) : task.length > 0 ? (
        task.map((item, index) => (
          <div className="task" key={index}>
            <h1>{item.title}</h1>
            <p>{item.msg}</p>
          </div>
        ))
      ) : (
        <p>No items available</p>
      )}
    </div>
  );
};

export default TaskPage;
