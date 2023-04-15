import React, { Component, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./component/Home";

import Voting from "./component/Voting/Voting";
import Results from "./component/Results/Results";
import Registration from "./component/Registration/Registration";

import AddCandidate from "./component/Admin/AddCandidate/AddCandidate";
import Verification from "./component/Admin/Verification/Verification";
import test from "./component/test";

// import Footer from "./component/Footer/Footer";

import "./App.css";
import LandingPage from "./component/LandingPage";
import LoginPage from "./component/Login";
import AdminPage from "./component/AdminHome";
import SignupPage from "./component/Signup";
import WebcamCapture from "./component/webcam";
import { authorize } from "./api";

const App = () => {
  const [isUserValid, setUserValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await authorize();
      if (data === "ok") {
        setUserValid(() => true);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="App">
      <Router>
        <Switch>
          {isUserValid ? (
            <Route exact path="/" component={LandingPage} />
          ) : (
            <Route exact path="/" component={LoginPage} />
          )}
          <Route exact path="/webcam" component={WebcamCapture}/>
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/signup" component={SignupPage} />
          <Route exact path="/admin" component={AdminPage} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/AddCandidate" component={AddCandidate} />
          <Route exact path="/Voting" component={Voting} />
          <Route exact path="/Results" component={Results} />
          <Route exact path="/Registration" component={Registration} />
          <Route exact path="/Verification" component={Verification} />
          <Route exact path="/test" component={test} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
class NotFound extends Component {
  render() {
    return (
      <>
        <h1>404 NOT FOUND!</h1>
        <center>
          <p>
            The page your are looking for doesn't exist.
            <br />
            Go to{" "}
            <Link
              to="/"
              style={{ color: "black", textDecoration: "underline" }}
            >
              Home
            </Link>
          </p>
        </center>
      </>
    );
  }
}
