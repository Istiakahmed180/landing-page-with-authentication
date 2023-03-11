import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { SiGnuprivacyguard } from "react-icons/si";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider";
import "../../styles/login.css";

const Signup = () => {
  const { createUser, userUpdateProfile, signOutUser } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    const name = userInfo.name;
    const email = userInfo.email;
    const password = userInfo.password;

    handleCreateUser(email, password, name);

    event.target.reset();
  };

  const handleNameChange = (event) => {
    setUserInfo({ ...userInfo, name: event.target.value });
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

  const handleCreateUser = (email, password, name) => {
    createUser(email, password)
      .then((result) => {
        const user = result.user;
        handleUserUpdateProfile(name);
        console.log(user);
        toast.success("User Create Successfull");
        navigate("/login");
        handleSignOut();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleUserUpdateProfile = (name) => {
    const profile = {
      displayName: name,
    };
    userUpdateProfile(profile)
      .then(() => {})
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleSignOut = () => {
    signOutUser().then(() => {});
  };

  return (
    <div className="login-container">
      <div className="login-title">
        Sign up <SiGnuprivacyguard />
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <input type="name" placeholder="Name" onChange={handleNameChange} />

        <input type="email" placeholder="Email" onChange={handleEmailChange} />
        {error?.email && (
          <div className="flex justify-center">
            <small className="error-message">{error.email}</small>
          </div>
        )}
        <input
          type="password"
          placeholder="Password"
          onChange={handlePasswordChange}
        />
        {error?.password && (
          <div className="flex justify-center">
            <small className="error-message">{error.password}</small>
          </div>
        )}
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
