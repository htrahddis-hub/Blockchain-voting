// Node modules
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Components
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

// CSS
import "./Results.css";

import ResultPie from "./piechart";
import AgeChart from "./AgeChart";
import GenderChart from "./GenderChart";

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      candidates: [],
      isElStarted: false,
      isElEnded: false,
    };
  }
  componentDidMount = async () => {
    // refreshing once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
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

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, ElectionInstance: instance, account: accounts[0] });

      // Get total number of candidates
      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Loadin Candidates detials
      for (let i = 1; i <= this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .candidateDetails(i - 1)
          .call();
        const candidateAgeArr = [];
        for (let j = 1; j <= candidate.voteCount; j++) {
          const candidateAge = await this.state.ElectionInstance.methods
            .candidatesVoterAges(i - 1, j - 1)
            .call();
          candidateAgeArr.push(parseInt(candidateAge));
        }
        this.state.candidates.push({
          id: candidate.candidateId,
          header: candidate.header,
          slogan: candidate.slogan,
          voteCount: parseInt(candidate.voteCount),
          voterAges: candidateAgeArr,
          maleVoters: parseInt(candidate.maleVoter),
          femaleVoters: candidate.voteCount - candidate.maleVoter,
        });
      }
      console.log(this.state.candidates);
      this.setState({ candidates: this.state.candidates });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }

    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <br />

        <div>
          {!this.state.isElStarted && !this.state.isElEnded ? (
            <NotInit />
          ) : this.state.isElStarted && !this.state.isElEnded ? (
            <div className="container-item attention">
              <center>
                <h3>The election is being conducted at the movement.</h3>
                <p>Result will be displayed once the election has ended.</p>
                <p>Go ahead and cast your vote {"(if not already)"}.</p>
                <br />
                <Link
                  to="/Voting"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  Voting Page
                </Link>
              </center>
            </div>
          ) : !this.state.isElStarted && this.state.isElEnded ? (
            displayResults(this.state.candidates)
          ) : null}
        </div>
      </>
    );
  }
}

function displayWinner(candidates) {
  const getWinner = (candidates) => {
    // Returns an object having maxium vote count
    let maxVoteRecived = 0;
    let winnerCandidate = [];
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i].voteCount > maxVoteRecived) {
        maxVoteRecived = candidates[i].voteCount;
        winnerCandidate = [candidates[i]];
      } else if (candidates[i].voteCount === maxVoteRecived) {
        winnerCandidate.push(candidates[i]);
      }
    }
    return winnerCandidate;
  };
  const renderWinner = (winner) => {
    return (
      <div className="container-winner">
        <div className="winner-info">
          <p className="winner-tag">Winner!</p>
          <h2> {winner.header}</h2>
          <p className="winner-slogan">{winner.slogan}</p>
        </div>
        <div className="winner-votes">
          <div className="votes-tag">Total Votes: </div>
          <div className="vote-count">{winner.voteCount}</div>
        </div>
      </div>
    );
  };
  const winnerCandidate = getWinner(candidates);
  return <>{winnerCandidate.map(renderWinner)}</>;
}

export function displayResults(candidates) {
  const renderResults = (candidate) => {
    return (
      <tr>
        <td>{candidate.id}</td>
        <td>{candidate.header}</td>
        <td>{candidate.voteCount}</td>
      </tr>
    );
  };

  return (
    <>
      {candidates.length > 0 ? (
        <div className="container-main">{displayWinner(candidates)}</div>
      ) : null}
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <h2>Results</h2>
        <small>Total candidates: {candidates.length}</small>
        {candidates.length < 1 ? (
          <div className="container-item attention">
            <center>No candidates.</center>
          </div>
        ) : (
          <>
            <div className="container-item">
              <table>
                <tr>
                  <th>Id</th>
                  <th>Candidate</th>
                  <th>Votes</th>
                </tr>
                {candidates.map(renderResults)}
              </table>
            </div>
            <div
              className="container-item"
              style={{ border: "1px solid black" }}
            ></div>
            <div className="container-main">
              <h2
                style={{
                  padding: "30px 20px",
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                Vote Distribution amongst candidates
              </h2>
              <ResultPie candidate={candidates} />
              <h2
                style={{
                  padding: "30px 20px",
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                Voter Distribution split by ages
              </h2>
              <AgeChart candidate={candidates} />
              <h2
                style={{
                  padding: "30px 20px",
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                Voter Distribution by gender
              </h2>
              <GenderChart candidate={candidates} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
