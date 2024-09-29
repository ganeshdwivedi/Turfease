import React from "react";
import { ErrorResponse, Link, useRouteError } from "react-router-dom";

interface RouerError extends ErrorResponse {
  message: string;
}

const ErrorElement = () => {
  const error = useRouteError() as RouerError;

  return (
    <div
      style={{
        backgroundImage: "url('/images/Cover.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          textAlign: "center",
          color: "#22356D",
          width: "465px",
          height: "198px",
          borderRadius: "7px",
          padding: "20px 0px 40px 0px",
          background: "white",
          marginTop: "9rem",
        }}
      >
        <p
          style={{
            fontSize: "2rem",
            textAlign: "center",
            fontFamily: "var(--font-semibold) !important",
          }}
        >
          Error 404
        </p>
        <div
          style={{
            fontFamily: "var(--font-regular) !important",
            fontSize: "22px",
          }}
        >
          Something went wrong
        </div>
        <div
          style={{
            fontFamily: "var(--font-regular) !important",
            fontSize: "19px",
            marginTop: "1.5rem",
            width: "198px",
            marginInline: "auto",
            height: "27px",
            borderRadius: "25px",
            padding: "4px 5px",
            boxShadow: "0px 4px 4px 0px #0000000D",
          }}
        >
          <Link to="/calendars">Go back to calendar</Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorElement;
