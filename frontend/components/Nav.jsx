import { Link } from "react-router-dom";
import { useReddit } from "../Context";

// nav bar component
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
        {isLoggedIn && (
          <>
            <div className="homeNewPostAndCategory">
              <li>
                {isLoggedIn ? (
                  <Link to="/home">Home</Link>
                ) : (
                  <Link to="/">Home</Link>
                )}
              </li>
              <li>
                <Link to="/new-category">New Category</Link>
              </li>
              <li>
                <Link to="/new-post">New Post</Link>
              </li>
            </div>

            <div className="profileAndLog">
              <li>
                <Link to="/profile">Profile</Link>
              </li>

              <li>
                {isLoggedIn ? (
                  <Link onClick={logOut} to="/">
                    Log out
                  </Link>
                ) : (
                  <Link to="/login">Log in</Link>
                )}
              </li>
            </div>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
