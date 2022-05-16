import { useEffect, useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch } from "react-redux";
import { register } from "../redux/apiCalls";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 20px 0px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
`;

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const { errorMessage, error, success } = useSelector(
    (state) => state.userRegister
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      username: username,
      password: password,
      cpassword: cPassword,
      email: email,
      isAdmin: false,
    };
    register(dispatch, payload);
    success === true && setAccountCreated(true);
  };

  useEffect(() => {
    if (success === true) {
      setUsername("");
      setEmail("");
      setPassword("");
      setCPassword("");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  }, [accountCreated, success,navigate]);

  console.log(errorMessage);
  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />
          <Input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
          <Input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
          />
          <Input
            name="c_password"
            type="password"
            value={cPassword}
            onChange={(e) => setCPassword(e.target.value)}
            placeholder="confirm password"
            required
          />
          {error && (
            <div style={{ marginTop: "10px" }}>{errorMessage.errors.user}</div>
          )}
          {success && (
            <div
              style={{ marginTop: "10px" }}
            >{`Account created successfully`}</div>
          )}
          <Agreement>
            By creating an account, I consent to the processing of my personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <Button type="submit">CREATE</Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Register;
