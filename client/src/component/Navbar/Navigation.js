import React, { useState } from "react";
import { NavLink,useHistory } from "react-router-dom";

import "./Navbar.css";

export default function Navbar() {
  const history = useHistory();
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    history.push("/login");
  };

  const [open, setOpen] = useState(false);
  return (
    <nav>
      <NavLink to="/home" className="header">
        <i className="fa fa-home"></i> Home
      </NavLink>
      <ul
        className="navbar-links mb-0"
        style={{ width: "35%", transform: open ? "translateX(0px)" : "" }}
      >
        <li>
          <NavLink to="/Registration" activeClassName="nav-active">
            <i className="far fa-registered" /> Registration
          </NavLink>
        </li>
        <li>
          <NavLink to="/Voting" activeClassName="nav-active">
            <i className="fas fa-vote-yea" /> Voting
          </NavLink>
        </li>
        <li>
          <NavLink to="/Results" activeClassName="nav-active">
            <i className="fas fa-poll-h" /> Results
          </NavLink>
        </li>
      </ul>
      <button type="button" class="btn btn-warning" onClick={handleLogout}>
        Logout
      </button>
      <i onClick={() => setOpen(!open)} className="fas fa-bars burger-menu"></i>
    </nav>
  );
}
