import "./App.css";
import { useState } from "react";
import LoggedInContext from "./LoggedInContext";
import {
  Home,
  EditHistory,
  EditWiki,
  ForumList,
  ForumPage,
  Login,
  Register,
  TagList,
  WikiPage,
  SearchWiki,
  AddWiki,
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
            <Route path="/page/:id/edit-history" element={<EditHistory />} />
            <Route path="/search" element={<SearchWiki />} />
            <Route path="/tags" element={<TagList />} />
            <Route path="/forum" element={<ForumList />} />
            <Route path="/forum/:id" element={<ForumPage />} />
            <Route path="/add-wiki" element={<AddWiki />} />
          </Routes>
        </Router>
      </LoggedInContext.Provider>
    </div>
  );
}

export default App;
