import React, { Suspense } from "react";
import Categories from "../components/Categories";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import Slider from "../components/Slider";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorBoundary";

const Products = React.lazy(() => import("../components/Products"));
const Announcement = React.lazy(() => import("../components/Announcement"));

const Home = () => {
  return (
    <div>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          window.location.reload();
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Announcement />
        </Suspense>
      </ErrorBoundary>
      <Navbar />
      <Slider />
      <Categories />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          window.location.reload();
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Loading...
            </div>
          }
        >
          <Products />
        </Suspense>
      </ErrorBoundary>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;
