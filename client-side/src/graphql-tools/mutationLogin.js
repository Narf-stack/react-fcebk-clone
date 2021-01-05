import gql from 'graphql-tag'


const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ) {
    login(
      registerInput: {
        username: $username
        password: $password
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default LOGIN_USER
