import React, { Component, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, NavLink, useHistory } from "react-router-dom";
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
  const history = useHistory();

  useEffect(() => {
    console.log("reloaded");

    const fetchAccounts = async () => {
      // For refreshing the page a single time
      // so that web3 and instance is loaded every time

      console.log("fetchAccountscalled");
      try {
        // Get network provider and web3 instance.
        console.log("awaiting web3");
        const web3 = await getWeb3();
        console.log(web3);
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Election.networks[networkId];
        const instance = new web3.eth.Contract(
          Election.abi,
          deployedNetwork && deployedNetwork.address
        );
        //  console.log(web3);
        console.log(instance);
        console.log(accounts);
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setElectionInstance(instance);
        setAccount(accounts[0]);

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

        // Total number of candidates
      } catch (error) {
        // Catch any errors for any of the above operations.
        console.error(error);
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
      }
    };
    fetchAccounts();
    // console.log(account, isElStarted, isAdmin);
    return () => {};
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    history.go("/login");
  };

  console.log(account, isAdmin, isElStarted);
  return (
    <>
      {0 ? (
        <>
          <center>Please reload (MetaMask error)</center>
        </>
      ) : (
        <div>
          <div>
            <nav className="navbar bg-body-tertiary">
              <div className="container-fluid ">
                <div className="justify-content-center">
                  <a className="navbar-brand" href="/">
                    E-Voting Blockchain
                  </a>
                </div>
                <button
                  type="button"
                  class="btn btn-outline-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
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
      )}
    </>
  );
};

export default LandingPage;
