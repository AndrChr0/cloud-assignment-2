import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";
import Landing from "../components/Landing";
import Nav from "../components/Nav";
import FYP from "../components/FYP";
import CategoryPage from "../components/CategoryPage";
import NewPost from "../components/NewPost";
import NewCategory from "../components/NewCategory";
import Profile from "../components/Profile";
import './App.css'

function App() {
  return (
    <>
      <Nav />
      <main>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/home" element={<FYP />} />
        <Route path="/category/:category_id" element={<CategoryPage/>} />
        <Route path="/new-post" element={<NewPost />} />
        <Route path="/new-category" element={<NewCategory />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
      </main>
    </>
  );
}

export default App;