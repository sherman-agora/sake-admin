import React, { useState, useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import Dns from "@material-ui/icons/Dns";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const CREATE_AUTH = gql`
  mutation CreateAuth($data: AuthCreateInput!) {
    createAuth(data: $data) {
      id
    }
  }
`;

function XeroCallback({ match, location }) {
  const code = location.search;
  const [createAuth] = useMutation(CREATE_AUTH);

  useEffect(() => {
    if (code) {
      createAuth({
        variables: {
          data: {
            apiUrl: `/Callback${code}`,
          },
        },
      }).then((value) => {
        window.location.href = "https://petgo-management-system.appspot.com/";
        // window.location.href = "http://localhost:3000/";
      });
    }
  }, [code]);

  return <div>Loading...</div>;
}

export default XeroCallback;
