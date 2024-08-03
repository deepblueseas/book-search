import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from '@apollo/client';

// Create an authLink to add the Authorization header
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('id_token'); // or however you're storing the token

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

// Create the Apollo Client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    authLink,
    new HttpLink({ uri: 'http://localhost:3001/graphql' }), 
  ]),
});

export default client;
