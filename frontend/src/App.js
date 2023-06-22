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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/navbar/navbar.js";

function App() {
  const NavbarLayout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  };

  const [loggedIn, setLoggedin] = useState(false);

  return (
    <div className="App">
      <LoggedInContext.Provider value={loggedIn}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<NavbarLayout />}>
              <Route path="/page/:id" element={<WikiPage />} />
              <Route path="/page/:id/history" element={<EditHistory />} />
              <Route path="/page/:id/history/:edit_id" element={<WikiPage />} />
              <Route path="/search" element={<SearchWiki />} />
              <Route path="/tags" element={<TagList />} />
              <Route path="/forum" element={<ForumList />} />
              <Route path="/forum/:id" element={<ForumPage />} />
              <Route path="/add-wiki" element={<AddWiki />} />
            </Route>
          </Routes>
        </Router>
      </LoggedInContext.Provider>
    </div>
  );
}

export default App;
