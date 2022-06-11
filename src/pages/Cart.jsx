import { Add, Remove } from "@material-ui/icons";
import styled from "styled-components";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { mobile } from "../responsive";
import { useSelector } from "react-redux";
import StripeCheckout from "react-stripe-checkout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { emptyCart, updateCart } from "../redux/cartRedux";
import { createOrder } from "../redux/apiCalls";
import { publicRequest, userRequest } from "../requestMethods";
import jwt_decode from "jwt-decode";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};
`;

const TopTexts = styled.div`
  ${mobile({ display: "none" })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: "5px 15px" })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: "20px" })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {
  const cartDetails = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const key = "pk_test_2UfCJJ7VpMDQs86ycq7BTDs7";
  const [stripeToken, setStripeToken] = useState(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onToken = async (token) => {
    let userDetail = JSON.parse(localStorage.getItem("user"));
    const accessToken = userDetail?.accessToken;
    let currentDate = new Date();
    const decodedToken = jwt_decode(accessToken);
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
      const refToken = userDetail?.refreshToken;
        try {
          const res = await publicRequest.post("auth/refresh", {
            token: refToken,
          });
          const { accessToken, refreshToken } = res.data;
          const newUser = {
            ...userDetail,
            accessToken,
            refreshToken,
          };
          localStorage.setItem("user", JSON.stringify(newUser));
          setStripeToken(token);
        } catch (err) {
          console.log(err);
        }
    }else{
      setStripeToken(token);
    }
  };

  let userDetail = JSON.parse(localStorage.getItem("user"));
  const TOKEN = userDetail?.accessToken;

  useEffect(() => {
    const sendToken = async () => {
      try {
        const config = {
          headers: { token: `Bearer ${TOKEN}` },
        };
        const payload = {
          tokenId: stripeToken.id,
          amount: cartDetails?.total.toFixed() * 100,
        };
        await userRequest.post("payment", payload, config);
        let productDetails = [];
        cartDetails.products.map((item) =>
          productDetails.push({ productId: item._id, quantity: item.quantity })
        );
        const orderPayload = {
          userId: user?._id,
          products: productDetails,
          amount: cartDetails?.total.toFixed(),
          address: "Chandigarh",
        };
        createOrder(dispatch, orderPayload);
        setOrderCreated(true);
        dispatch(emptyCart({}));
      } catch (err) {}
    };
    stripeToken && cartDetails?.total >= 1 && sendToken();
  }, [
    stripeToken,
    cartDetails?.total,
    cartDetails.products,
    dispatch,
    user?._id,
    TOKEN,
  ]);

  const handleQuantity = (type, pid) => {
    if (type === "add") {
      const product = cartDetails.products.find((item) => item._id === pid);
      dispatch(updateCart({ ...product, quantity: product.quantity + 1 }));
    } else {
      const product = cartDetails.products.find((item) => item._id === pid);
      if (product.quantity >= 1) {
        dispatch(
          updateCart({
            ...product,
            quantity: product.quantity >= 1 ? product.quantity - 1 : 0,
          })
        );
      }
    }
  };

  const clearCart = () => {
    dispatch(emptyCart());
  };

  const handleAlert = (type) => {
    if (type === "confirm") {
      navigate("/");
    } else {
      navigate("/");
    }
  };

  const handleCheckout = () => {
    navigate("/login");
  };

  return (
    <Container>
      <Navbar />
      {orderCreated ? (
        <SweetAlert
          title={"Order Created Successfully"}
          onConfirm={() => handleAlert("confirm")}
          onCancel={() => handleAlert("cancel")}
          dependencies={[orderCreated]}
        ></SweetAlert>
      ) : (
        ""
      )}
      <Announcement />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton>CONTINUE SHOPPING</TopButton>
          <TopTexts>
            <TopText>Shopping Bag({cartDetails?.quantity})</TopText>
            <TopText>Your Wishlist (0)</TopText>
          </TopTexts>
          <TopButton onClick={clearCart} type="filled">
            CLEAR CART
          </TopButton>
        </Top>
        <Bottom>
          <Info>
            {cartDetails.products.map((product) => (
              <Product key={product._id}>
                <ProductDetail>
                  <Image src={product?.img} />
                  <Details>
                    <ProductName>
                      <b>Product:</b> {product?.title}
                    </ProductName>
                    <ProductId>
                      <b>ID:</b> {product?._id}
                    </ProductId>
                    <ProductColor color={product?.color} />
                    <ProductSize>
                      <b>Size:</b> {product?.size}
                    </ProductSize>
                  </Details>
                </ProductDetail>
                <PriceDetail>
                  <ProductAmountContainer>
                    <Add onClick={() => handleQuantity("add", product._id)} />
                    <ProductAmount>{product?.quantity}</ProductAmount>
                    <Remove
                      onClick={() => handleQuantity("remove", product._id)}
                    />
                  </ProductAmountContainer>
                  <ProductPrice>
                    $ {Math.floor(product?.price * product?.quantity)}
                  </ProductPrice>
                </PriceDetail>
              </Product>
            ))}
            <Hr></Hr>
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>
                $ {Math.floor(cartDetails?.total)}
              </SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem type="total">
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>
                $ {Math.floor(cartDetails?.total)}
              </SummaryItemPrice>
            </SummaryItem>
            {user ? (
              <StripeCheckout
                name="LABEL A"
                description={`Your cart total is ${~~cartDetails?.total}`}
                amount={cartDetails?.total.toFixed() * 100}
                token={onToken}
                stripeKey={key}
                currency="USD"
              >
                <Button disabled={cartDetails?.total <= 0 ? true : false}>
                  CHECKOUT NOW
                </Button>
              </StripeCheckout>
            ) : (
              <Button
                disabled={cartDetails?.total <= 0 ? true : false}
                onClick={handleCheckout}
              >
                CHECKOUT NOW
              </Button>
            )}
          </Summary>
        </Bottom>
      </Wrapper>
      <Footer />
    </Container>
  );
};

export default Cart;
