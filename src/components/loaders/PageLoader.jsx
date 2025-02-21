import { CircularProgress, Progress } from "@chakra-ui/react";
import React from "react";

const PageLoader = ({ isLoading }) => {
  if (!isLoading) {
    return;
  }
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <CircularProgress isIndeterminate size="50px" color="#fc1e65" />
      <h2
        style={{
          zIndex: 9999,
          color: "white",
          marginTop: "8px",
        }}
      >
        SendTruly
      </h2>
      {/* <Progress
        size="md"
        width="70%"
        background="transparent"
        colorScheme="pink"
        isIndeterminate
      /> */}
      {/* <div
        style={{
          color: "#fff",
          fontSize: "24px",
          textAlign: "center",
        }}
      >
        Loading...
      </div> */}
    </div>
  );
};

export default PageLoader;
