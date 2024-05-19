import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "../components/Register";
import Login from "../components/Login";
import Landing from "../components/Landing";
import Nav from "../components/Nav";
import FYP from "../components/FYP";
import CategoryPage from "../components/CategoryPage";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/home" element={<FYP />} />
        <Route path="/category/:category_id" element={<CategoryPage/>} />
        
      </Routes>
    </>
  );
}

export default App;
