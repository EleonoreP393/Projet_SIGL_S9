import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home.jsx";
import './App.css'
import Login from './pages/login'
import Changemdp from "./pages/changemdp.jsx";
import JournalDeFormation from './pages/JournalDeFormation'
import Notification from './pages/notification'


function RequireAuth({ children }) {
  const isAuthed = Boolean(localStorage.getItem("auth"));
  return isAuthed ? children : <Navigate to="/login" replace />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/changemdp" element={<Changemdp />}/>
        <Route path="/notifications" element={<Notification />} />
        <Route path="/journal" element={<JournalDeFormation />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
