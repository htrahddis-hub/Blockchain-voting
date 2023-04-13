import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import bgimg from "../background.png";

// CSS
import "./login.css";

// const buttonRef = React.createRef();
const LoginPage = () => {
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
                <div class="form-floating mb-3">
                  <input
                    type="email"
                    class="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                  />
                  <label for="floatingInput">Email address</label>
                </div>
                <div class="form-floating mb-4">
                  <input
                    type="password"
                    class="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label for="floatingPassword">Password</label>
                </div>
                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-secondary btn-block mb-4"
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
