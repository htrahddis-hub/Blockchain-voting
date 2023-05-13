import React, { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";

import "./Navbar.css";

export default function NavbarAdmin() {
  const history = useHistory();
  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    history.push("/login");
  };

  const [open, setOpen] = useState(false);
  return (
    <nav>
      <div className="header">
        <NavLink to="/admin">
          <i className="fa fa-user" /> Admin
        </NavLink>
      </div>
      <ul
        className="navbar-links mb-0"
        style={{ transform: open ? "translateX(0px)" : "" }}
      >
        <li>
          <NavLink to="/Verification" activeClassName="nav-active">
            <i className="fa fa-check" /> Verification
          </NavLink>
        </li>
        <li>
          <NavLink to="/AddCandidate" activeClassName="nav-active">
            <i className="fa fa-plus" /> Add Candidate
          </NavLink>
        </li>
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
