import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import bgimg from "../background.png";
import { login } from "../api";

// CSS
import "./login.css";

// const buttonRef = React.createRef();
const LoginPage = () => {
  const history = useHistory();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({
    visible: false,
    type: "",
    text: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMessage((prev) => {
      return {
        ...prev,
        type: "",
        visible: false,
        text: "",
      };
    });
    setUser((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await login(user);
    if (data === "ok") {
      setMessage((prev) => {
        return {
          ...prev,
          type: "good",
          visible: true,
          text: "Login Successful",
        };
      });
      window.location.assign("/");
    } else {
      setMessage((prev) => {
        return {
          ...prev,
          type: "bad",
          visible: true,
          text: data,
        };
      });
    }
    setUser({
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div>
      <div>
        <nav className="navbar bg-body-tertiary">
          <div className="container-fluid justify-content-center">
            <a className="navbar-brand" href="/">
              E-Voting Blockchain
            </a>
          </div>
        </nav>
      </div>
      <div className="container-fluid">
        <div className="row mt-5 m-2">
          <div className="col-7">
            <div className="h-100">
              <img
                src={bgimg}
                alt="E-votig"
                style={{ height: "75vh" }}
                width="95%"
              />
            </div>
          </div>
          <div className="col-5">
            <h2>Electronic Voting on Blockchain</h2>

            <div className="box py-3">
              <div className="form px-3">
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                {message.visible ? (
                  <p style={{ color: message.type === "bad" ? "red" : "blue" }}>
                    {message.text}
                  </p>
                ) : (
                  <></>
                )}
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-secondary btn-block mb-4"
                    onClick={handleSubmit}
                  >
                    Login
                  </button>
                </div>
                <Link to="/signup">
                  <div className="text-primary">
                    <p>New User?</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
