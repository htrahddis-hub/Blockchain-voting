import axios from "axios";

const url = "http://localhost:3001/auth/";

export const signup = async (user) => {
  try {
    const { data } = await axios.post(url + "signup", { data: user });
    console.log(data);
    if (data.message === "Signup successful") return "ok";
  } catch (err) {
    return err.response.data.message;
  }
};

export const login = async (user) => {
  try {
    const { data } = await axios.post(url + "login", { data: user });
    if (data.message === "Login Successful") {
      const d = new Date();
      d.setTime(d.getTime() + 2 * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = `token=${data.jwt}; ${expires}; path=/;`;
      return "ok";
    }
  } catch (err) {
    return err.response.data.message;
  }
};

export const authorize = async () => {
  try {
    let token = decodeURIComponent(document.cookie);
    token = { token: token.substring(6) };
    // console.log(token);
    const { data } = await axios.post(url + "verify", { data: token });
    if (data.message === "verification successful") return "ok";
  } catch (err) {
    return err.response.data.message;
  }
};
