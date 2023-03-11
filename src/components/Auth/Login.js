import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { BiLogInCircle } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider";
import "../../styles/login.css";

const Login = () => {
  const { user, loading, setLoading, signInUser, signInGoogleUser } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const email = userInfo.email;
    const password = userInfo.password;

    handleSignInUser(email, password);

    event.target.reset();
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError({ ...error, email: "Please Provide Your Valid Email" });
      setUserInfo({ ...userInfo, email: "" });
    } else {
      setError({ ...error, email: "" });
      setUserInfo({ ...userInfo, email: event.target.value });
    }
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    if (!/(?=.*[A-Z])/.test(password)) {
      setError({
        ...error,
        password: "Ensure the password has one uppercase letters",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!/(?=.*[!@#$&*])/.test(password)) {
      setError({
        ...error,
        password: "Ensure the password has one special character",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError({
        ...error,
        password: "One numeric value must be used in the password",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else if (!/.{8}/.test(password)) {
      setError({
        ...error,
        password: "Ensure password should be at least 8 charecters",
      });
      setUserInfo({ ...userInfo, password: "" });
    } else {
      setError({ ...error, password: "" });
      setUserInfo({ ...userInfo, password: event.target.value });
    }
  };

  const handleSignInUser = (email, password) => {
    signInUser(email, password)
      .then((result) => {
        const user = result.user;
        toast.success("User Login Successfull");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    signInGoogleUser()
      .then((result) => {
        const user = result.user;
        toast.success("Google Login Successfull");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-title">
        Login
        <BiLogInCircle />
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Your Email"
          onChange={handleEmailChange}
        />
        {error?.email && (
          <div className="flex justify-center">
            <small className="error-message">{error.email}</small>
          </div>
        )}
        <input
          type="password"
          placeholder="password"
          onChange={handlePasswordChange}
        />
        {error?.password && (
          <div className="flex justify-center">
            <small className="error-message">{error.password}</small>
          </div>
        )}
        <button>Login</button>

        <p>
          Don't have an account? <Link to="/signup">Sign up first</Link>
        </p>
      </form>

      <button onClick={handleGoogleLogin}>Google</button>
    </div>
  );
};

export default Login;
