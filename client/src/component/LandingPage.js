import React, { Component, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink } from "react-router-dom";
import bgimg from "../background.png";
import getWeb3 from "../getWeb3";
import Election from "../contracts/Election.json";

// CSS
import "./Home.css";

// const buttonRef = React.createRef();
const LandingPage = () => {
  const [electionInstance, setElectionInstance] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isElStarted, setIsElStarted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const fetchAccounts = async () => {
    try {
      // Get network provider and web3 instance.

      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );

      console.log(accounts);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      setWeb3(web3);
      setElectionInstance(instance);
      setAccount(accounts[0]);

      console.log(electionInstance);
      if (instance != null) {
        const start = await instance.methods.getStart().call();
        setIsElStarted(start);
        // console.log(account);
        console.log(start);
        if (start === true) {
          const admin = await instance.methods.getAdmin().call();
          console.log(admin);

          if (accounts[0] === admin) {
            setIsAdmin(true);
          }
        }
      }

      // Total number of candidates
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
    }
  };
  useEffect(() => {
    console.log("reloaded");
    fetchAccounts();
  }, [electionInstance, isElStarted, isAdmin, account]);
  console.log(account, isElStarted, isAdmin);
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
              {isElStarted === false || isAdmin === true ? (
                <>
                  <button className="btn btn-info mt-5 me-3">
                    <NavLink to="/admin">Organise</NavLink>
                  </button>
                  <p className="mt-5 p-2 h6">Or</p>
                </>
              ) : null}

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
