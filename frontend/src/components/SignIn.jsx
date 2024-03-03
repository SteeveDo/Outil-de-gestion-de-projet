import React, { useState } from "react";
import { FormControl, FormGroup, FormLabel } from "react-bootstrap";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [passWord, setPassWord] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePassWordChange = (e) => {
    setPassWord(e.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      
    </form>
  );
};

export default SignIn;
