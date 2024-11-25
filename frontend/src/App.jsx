import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import TaskPage from "./TaskPage";  // The task page we will create below

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<TaskPage />} /> {/* Main Task Page */}
      </Routes>
    </Router>
  );
};

export default App;
