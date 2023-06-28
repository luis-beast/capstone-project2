import { useState } from "react";
import UserContext from "./userContext";
import {
  Home,
  EditHistory,
  EditWiki,
  ForumList,
  ForumPage,
  LoginPage,
  Register,
  TagList,
  WikiPage,
  SearchWiki,
  AddWiki,
  UserEdits,
} from "./pages";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Navbar, Gatekeeper } from "./components";
import useSessionStorageState from "./useSessionStorageState";

function App() {
  const NavbarLayout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  };

  const SecurePage = ({ userData }) => {
    return (
      <>
        <Gatekeeper userData={userData} />
        <Outlet />
      </>
    );
  };

  const [userData, setUserData] = useSessionStorageState({}, "user-data");

  return (
    <div className="App">
      <UserContext.Provider value={[userData, setUserData]}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<NavbarLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/page/:id" element={<WikiPage />} />
              <Route path="/page/:id/history" element={<EditHistory />} />
              <Route path="/page/:id/history/:edit_id" element={<WikiPage />} />
              <Route path="/user/:id/history" element={<UserEdits />} />
              <Route path="/search" element={<SearchWiki />} />
              <Route path="/tags" element={<TagList />} />
              <Route path="/forum" element={<ForumList />} />
              <Route path="/forum/:id" element={<ForumPage />} />
              <Route element={<SecurePage userData={userData} />}>
                <Route path="/page/:id/edit" element={<EditWiki />} />
                <Route path="/add-wiki" element={<AddWiki />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </UserContext.Provider>
    </div>
  );
}

export default App;
