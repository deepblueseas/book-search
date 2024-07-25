const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
// import middleware equivalent
const { signToken } = require('../utils/auth');

const resolvers = {

    // this is the equivalent to the /me GET route
    Query: {
      me: async (parent, args, context) => {
        if (context.user) {
          return User.findById(context.user._id).populate('savedBooks');
        }
        throw new AuthenticationError('Not logged in');
      },
    //if the logged in user wanted to search for another user on the site
      user: async (parent, { username }) => {
        return User.findOne({ username }).populate('savedBooks');
      },
    },


    Mutation: {
      // based on a couple of our modules, esp that 17-ins-jwt-review
      login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const correctPw = await user.isCorrectPassword(password);
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
        const token = signToken(user);
        return { token, user };
      },


      // equivalent of createUser route
      addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });
        const token = signToken(user);

        return { token, user };
      },

      // equivalent of the put saveBook route
      saveBook: async (parent, { bookInput }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            // MONGO built-in query
            { $addToSet: { savedBooks: bookInput } },
            { new: true }
          ).populate('savedBooks');
          return updatedUser;
        }
        throw new AuthenticationError('Not logged in');
      },

      // delete book by bookId
      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            context.user._id,
            // similar to .filter
            { $pull: { savedBooks: { bookId } } },
            { new: true }
          ).populate('savedBooks');
          return updatedUser;
        }
        throw new AuthenticationError('Not logged in');
      },
    },
  };
  
  module.exports = resolvers;