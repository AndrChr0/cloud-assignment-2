import { Link } from "react-router-dom";
import { useReddit } from "../Context";

// Nav bar component
const Nav = () => {
  const { isLoggedIn, setIsLoggedIn } = useReddit();  // Retrieve userID from context


  const id = localStorage.getItem("userID");

  const logOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("userID");
  };

  return (
    <nav>
      <ul>
        <div className="homeNewPostAndCategory">
          <li>
            {isLoggedIn ? (
              <Link to="/home">FakeReddit</Link>
            ) : (
              <Link to="/">Home</Link>
            )}
          </li>
        </div>
        <div className="profileAndLog">
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/new-category">New Category</Link>
              </li>
              <li>
                <Link to="/new-post">New Post</Link>
              </li>
              <li>
                <Link to={`/profile/${id}`}>Profile</Link>  {/* Dynamic profile link */}
              </li>
              {isLoggedIn && <li>|</li>}
            </>
          ) : (
            ""
          )}

          <li>
            {isLoggedIn ? (
              <Link onClick={logOut} to="/" style={{ color: "red" }}>
                Log out
              </Link>
            ) : (
              <>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <Link to="/login">Log in</Link>
                  <Link
                    to="/register"
                    style={{
                      border: "2px solid #007bff",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Nav;
