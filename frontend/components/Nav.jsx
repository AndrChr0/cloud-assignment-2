import { Link } from "react-router-dom";
import { useReddit } from "../Context";

const Nav = () => {
  const { isLoggedIn, setIsLoggedIn } = useReddit();

  const logOut = () => {
    setIsLoggedIn(false);
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          {isLoggedIn ? (
            <Link onClick={logOut} to="/">Log out</Link>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
