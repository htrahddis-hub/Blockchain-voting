// Node modules
import React, { Component } from "react";

// Components
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";
import axios from "axios";
// CSS
import "./Registration.css";

// Contract
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/Election.json";

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      account: null,
      isAdmin: false,
      isElStarted: false,
      isElEnded: false,
      voterCount: undefined,
      voterGender: "male",
      voterName: "",
      voterPhone: "",
      fileUploadError: 0,
      voters: [],
      voterID: null,
      voterAge: 0,
      currentVoter: {
        address: undefined,
        name: null,
        phone: null,
        age: 0,
        gender: null,
        hasVoted: false,
        isVerified: false,
        isRegistered: false,
      },
    };
  }

  // refreshing once
  componentDidMount = async () => {
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
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      // Admin account and verification
      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Get start and end values
      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      // Total number of voters
      const voterCount = await this.state.ElectionInstance.methods
        .getTotalVoter()
        .call();
      this.setState({ voterCount: voterCount });

      // Loading all the voters
      for (let i = 0; i < this.state.voterCount; i++) {
        const voterAddress = await this.state.ElectionInstance.methods
          .voters(i)
          .call();
        const voter = await this.state.ElectionInstance.methods
          .voterDetails(voterAddress)
          .call();
        const genderString = voter.gender ? "male" : "female";
        this.state.voters.push({
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
          age: voter.age,
          gender: genderString,
        });
      }
      this.setState({ voters: this.state.voters });

      // Loading current voters
      const voter = await this.state.ElectionInstance.methods
        .voterDetails(this.state.account)
        .call();
      const genderString = voter.gender ? "male" : "female";
      this.setState({
        currentVoter: {
          address: voter.voterAddress,
          name: voter.name,
          phone: voter.phone,
          hasVoted: voter.hasVoted,
          isVerified: voter.isVerified,
          isRegistered: voter.isRegistered,
          age: voter.age,
          gender: genderString,
        },
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.error(error);
      alert(
        `Failed to load web3, accounts, or contract. Check console for details (f12).`
      );
    }
  };
  updateVoterName = (event) => {
    this.setState({ voterName: event.target.value });
  };
  updateVoterPhone = (event) => {
    this.setState({ voterPhone: event.target.value });
  };
  updateVoterAge = (event) => {
    this.setState({ voterAge: event.target.value });
  };
  updateVoterID = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    console.log(formData);
    const img = event.target.files[0];
    console.log(event.target.files[0]);
    await axios
      .post("http://localhost:3001/kyc/detect", formData, {})
      .then((res) => {
        console.log(res);
        if (res.data.isFace === true) {
          this.setState({
            voterID: img,
            fileUploadError: 2,
          });
        } else this.setState({ fileUploadError: 1 });
      });
  };
  updateVoterGender = (event) => {
    this.setState({ voterGender: event.target.value });
  };
  registerAsVoter = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("file", this.state.voterID);
    let token = decodeURIComponent(document.cookie);
    token = { token: token.substring(6) };
    console.log(token);
    formData.append("token", token.token);
    for (const value of formData.values()) {
      console.log(value);
    }
    await axios
      .post("http://localhost:3001/kyc/image", formData, {})
      .then((res) => {
        console.log(res);
      });
    const genderBoolean = this.state.voterGender === "male" ? 1 : 0;
    await this.state.ElectionInstance.methods
      .registerAsVoter(
        this.state.voterName,
        this.state.voterPhone,
        this.state.voterAge,
        genderBoolean
      )
      .send({ from: this.state.account, gas: 1000000 });
    window.location.reload();
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
        {!this.state.isElStarted && !this.state.isElEnded ? (
          <NotInit />
        ) : (
          <>
            <div className="container-item info">
              <p>Total registered voters: {this.state.voters.length}</p>
            </div>
            <div className="container-main">
              <h3>Registration</h3>
              <small>Register to vote.</small>
              <div className="container-item">
                <form>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Account Address
                      <input
                        className={"input-r"}
                        type="text"
                        value={this.state.account}
                        style={{ width: "400px" }}
                      />{" "}
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Name
                      <input
                        className={"input-r"}
                        type="text"
                        placeholder="eg. Ava"
                        value={this.state.voterName}
                        onChange={this.updateVoterName}
                      />{" "}
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Phone number <span style={{ color: "tomato" }}>*</span>
                      <input
                        className={"input-r"}
                        type="number"
                        placeholder="eg. 9841234567"
                        value={this.state.voterPhone}
                        onChange={this.updateVoterPhone}
                      />
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Age <span style={{ color: "tomato" }}>*</span>
                      <input
                        className={"input-r"}
                        type="number"
                        placeholder="Age must be between 18 and 120"
                        value={this.state.voterAge}
                        onChange={this.updateVoterAge}
                      />
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      Gender <span style={{ color: "tomato" }}>*</span>
                      <select
                        required
                        className={"input-r"}
                        placeholder=""
                        value={this.state.voterGender}
                        onChange={this.updateVoterGender} // the onChange and value dont work rn need to be fixed
                      >
                        <option selected value="male">
                          male
                        </option>
                        <option value="female">female</option>
                      </select>
                    </label>
                  </div>
                  <div className="div-li">
                    <label className={"label-r"}>
                      ID CARD <span style={{ color: "tomato" }}>*</span>
                      <input
                        className={"input-r"}
                        type="file"
                        placeholder="Image of your ID"
                        onChange={this.updateVoterID}
                      />
                      {this.state.fileUploadError === 1 ? (
                        <div class="alert alert-danger" role="alert">
                          Face not detected , Please upload valid ID card .
                        </div>
                      ) : null}
                    </label>
                  </div>

                  <p className="note">
                    <span style={{ color: "tomato" }}> Note: </span>
                    <br /> Make sure your account address and Phone number are
                    correct. <br /> Admin might not approve your account if the
                    provided Phone number nub does not matches the account
                    address registered in admins catalogue.
                  </p>
                  <button
                    className="btn-add"
                    disabled={
                      this.state.voterPhone.length !== 10 ||
                      this.state.currentVoter.isVerified ||
                      this.state.voterAge < 18 ||
                      this.state.voterAge > 120 ||
                      this.state.fileUploadError !== 2
                    }
                    onClick={this.registerAsVoter}
                  >
                    {this.state.currentVoter.isRegistered
                      ? "Update"
                      : "Register"}
                  </button>
                </form>
              </div>
            </div>
            <div
              className="container-main"
              style={{
                borderTop: this.state.currentVoter.isRegistered
                  ? null
                  : "1px solid",
              }}
            >
              {loadCurrentVoter(
                this.state.currentVoter,
                this.state.currentVoter.isRegistered
              )}
            </div>
            {this.state.isAdmin ? (
              <div
                className="container-main"
                style={{ borderTop: "1px solid" }}
              >
                <small>TotalVoters: {this.state.voters.length}</small>
                {loadAllVoters(this.state.voters)}
              </div>
            ) : null}
          </>
        )}
      </>
    );
  }
}
export function loadCurrentVoter(voter, isRegistered) {
  return (
    <>
      <div
        className={"container-item " + (isRegistered ? "success" : "attention")}
      >
        <center>Your Registered Info</center>
      </div>
      <div
        className={"container-list " + (isRegistered ? "success" : "attention")}
      >
        <table>
          <tr>
            <th>Account Address</th>
            <td>{voter.address}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{voter.name}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{voter.phone}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{voter.gender}</td>
          </tr>
          <tr>
            <th>Age</th>
            <td>{voter.age}</td>
          </tr>
          <tr>
            <th>Voted</th>
            <td>{voter.hasVoted ? "True" : "False"}</td>
          </tr>

          <tr>
            <th>Verification</th>
            <td>{voter.isVerified ? "True" : "False"}</td>
          </tr>
          <tr>
            <th>Registered</th>
            <td>{voter.isRegistered ? "True" : "False"}</td>
          </tr>
        </table>
      </div>
    </>
  );
}
export function loadAllVoters(voters) {
  const renderAllVoters = (voter) => {
    return (
      <>
        <div className="container-list success">
          <table>
            <tr>
              <th>Account address</th>
              <td>{voter.address}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{voter.name}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{voter.phone}</td>
            </tr>
            <tr>
              <th>Age</th>
              <td>{voter.age}</td>
            </tr>
            <tr>
              <th>Gender</th>
              <td>{voter.gender}</td>
            </tr>
            <tr>
              <th>Voted</th>
              <td>{voter.hasVoted ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Verified</th>
              <td>{voter.isVerified ? "True" : "False"}</td>
            </tr>
            <tr>
              <th>Registered</th>
              <td>{voter.isRegistered ? "True" : "False"}</td>
            </tr>
          </table>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="container-item success">
        <center>List of voters</center>
      </div>
      {voters.map(renderAllVoters)}
    </>
  );
}
