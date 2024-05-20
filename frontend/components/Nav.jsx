import { Link } from "react-router-dom";
import { useReddit } from "../Context";



const Nav = () => {
  const { isLoggedIn, setIsLoggedIn } = useReddit();

  const logOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("userID");
  };

  return (
    <nav>
      <ul>
        <li>
          {isLoggedIn ? <Link to="/home">Home</Link> : <Link to="/">Home</Link>}
        </li>

        {isLoggedIn && (
          <>
            <li>
              <Link to="/new-post">New Post</Link>
            </li>
            <li>
              <Link to="/new-category">New Category</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </>
        )}
        <li>
          {isLoggedIn ? (
            <Link onClick={logOut} to="/">
              Log out
            </Link>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;