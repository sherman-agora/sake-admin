import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import Dns from "@material-ui/icons/Dns";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const CREATE_REDIRECT = gql`
  mutation CreateRedirect {
    createRedirect(data: {}) {
      id
      redirectUrl
    }
  }
`;

const CHECKING = gql`
  query Check {
    checking
  }
`;

const DISCONNECT = gql`
  mutation Disconnect {
    disconnect
  }
`;
function Xero() {
  const { loading, error, data } = useQuery(CHECKING);

  const [createRedirect] = useMutation(CREATE_REDIRECT);
  const [createDisconnect] = useMutation(DISCONNECT);
  // var status;

  if (error) {
    return <div>Error</div>;
  }
  if (!data && loading) {
    return <div>loading...</div>;
  }

  const handleDisconnect = () => {
    createDisconnect();
    // window.location.href = "http://localhost:3000/";
    window.location.href = "https://petgo-managementx-system.appspot.com/";
  };
  if (data.checking === "AUTH") {
    return (
      <div>
        <Grid container justify="center">
          <Button variant="contained" disabled>
            Already Connect to Xero
          </Button>
        </Grid>
        <Grid container justify="center">
          <Button color="primary" onClick={handleDisconnect}>
            disconnect
          </Button>
        </Grid>
      </div>
    );
  }

  const handleClick = () => {
    createRedirect({ variables: {} }).then((value) => {
      const redirectUrl = value.data.createRedirect.redirectUrl;
      console.log("Xero data: " + redirectUrl);
      window.location.href = redirectUrl;
    });
  };
  return (
    <div>
      <Fab
        variant="extended"
        color="primary"
        aria-label="add"
        onClick={handleClick}
      >
        <Dns />
        Login to Xero
      </Fab>
    </div>
  );
}

export default Xero;
