import { useEffect, useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useDispatch } from "react-redux";
import { login } from "../redux/apiCalls";
import { useSelector } from "react-redux";
import { clear } from "../redux/userRedux";
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984650/pexels-photo-6984650.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 25%;
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
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px 0;
  padding: 10px;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin-bottom: 10px;
`;

const Link = styled.a`
  margin: 5px 0px;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { errorMessage } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clear());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(dispatch, { username: username, password: password });
  };

  return (
    <Container>
      <Wrapper>
        <Title>SIGN IN</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            autocomplete="username"
          />
          <Input
            type="password"
            autocomplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <Button type="submit">LOGIN</Button>
          {errorMessage && errorMessage.errors.user}
          <Link>DO NOT YOU REMEMBER THE PASSWORD?</Link>
          <Link>CREATE A NEW ACCOUNT</Link>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Login;
