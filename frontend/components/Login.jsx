
const Login = () => {
    return (
        <div>
        <h2>Login</h2>
        <form>
            <label>
            Username:
            <input type="text" name="username" />
            </label>
            <label>
            Password:
            <input type="password" name="password" />
            </label>
            <button type="submit">Submit</button>
        </form>
        </div>
    );
    }   

    export default Login;