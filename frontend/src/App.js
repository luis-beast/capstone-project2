import "./App.css";
import {
  Home,
  EditHistory,
  EditWiki,
  Forum,
  Login,
  Register,
  TagList,
  WikiPage,
} from "./pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <h1>WikiForces</h1>
      <Home />
    </div>
  );
}

export default App;
