const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { GraphQLError } = require('graphql');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

const authMiddleware = ({ req }) => {
  let token = req.headers.authorization || '';

  if (token.startsWith('Bearer ')) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return { user: null }; // No token, no user
  }

  try {
    const { data } = jwt.verify(token, secret, { maxAge: expiration });
    return { user: data }; // Provide user data
  } catch (err) {
    console.log('Invalid token:', err);
    return { user: null }; // Invalid token, no user
  }
};

module.exports = {
  // Directly use GraphQLError in resolvers
  authMiddleware,
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};