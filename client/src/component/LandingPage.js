import React, { Component } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";

// CSS
import "./Home.css";

// const buttonRef = React.createRef();
export default function LandingPage() {
  return (
    <div>
      <button>
        <NavLink to="/admin">Organise</NavLink>
      </button>

      <button>
        {" "}
        <NavLink to="/home">Home</NavLink>
      </button>
    </div>
  );
}
