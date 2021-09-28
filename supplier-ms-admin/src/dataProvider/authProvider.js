import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { apolloClient } from "./index";

const GET_USER = gql`
  query users($where: UserWhereInput) {
    users(where: $where) {
      id
      name
      password
      permission
      group {
        id
        name
      }
    }
  }
`;

const authProvider = {
  login: async ({ username, password }) => {
    const response = await apolloClient.query({
      query: GET_USER,
      variables: {
        where: {
          AND: [
            {
              name: username,
            },
            {
              password: password,
            },
          ],
        },
      },
    });
    const loginUser = response.data.users[0];
    if (response.data.users.length === 0) {
      throw new Error("Login Error");
    }
    localStorage.setItem("token", loginUser.id);
    localStorage.setItem("userName", loginUser.name);
    localStorage.setItem("permissions", loginUser.permission.toLowerCase());
    localStorage.setItem(
      "group",
      JSON.stringify({
        name: loginUser.group.name,
        id: loginUser.group.id,
      })
    );
    return Promise.resolve(loginUser);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("group");
    return Promise.resolve();
  },
  checkAuth: () => {
    console.log("checkAuth", localStorage.getItem("token"));
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },
  checkError: (error) => {
    console.log("checkError", error);
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    const role = localStorage.getItem("permissions");
    return role ? Promise.resolve(role) : Promise.reject();
  },
};

export default authProvider;
