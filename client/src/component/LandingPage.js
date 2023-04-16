import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";
import bgimg from "../background.png";

// CSS
import "./Home.css";

// const buttonRef = React.createRef();
const LandingPage = () => {
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
          <div className="col-8">
            <div className="h-100">
              <img
                src={bgimg}
                alt="E-votig"
                style={{ height: "75vh" }}
                width="95%"
              />
            </div>
          </div>
          <div className="col-4">
            <h1>Electronic Voting on Blockchain</h1>
            <div className="d-flex justify-content-center">
              <button className="btn btn-info mt-5 me-3">
                <NavLink to="/admin">Organise</NavLink>
              </button>
              <p className="mt-5 p-2 h6">Or</p>
              <button className="ms-3 btn btn-info mt-5">
                <NavLink to="/home">Vote</NavLink>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
