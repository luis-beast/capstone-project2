import "./App.css";
import { useState } from "react";
import LoggedInContext from "./LoggedInContext";
import {
  Home,
  EditHistory,
  EditWiki,
  Forum,
  Login,
  Register,
  TagList,
  WikiPage,
  SearchWiki,
} from "./pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedin] = useState(false);

  return (
    <div className="App">
      <LoggedInContext.Provider value={loggedIn}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page/:id" element={<WikiPage />} />
            <Route path="/search" element={<SearchWiki />} />
            <Route path="/tags" element={<TagList />} />
            <Route path="/forum" element={<Forum />} />
          </Routes>
        </Router>
      </LoggedInContext.Provider>
    </div>
  );
}

export default App;
