// const jwt = require('jsonwebtoken');

// // set token secret and expiration date
// const secret = 'mysecretsshhhhh';
// const expiration = '2h';

// module.exports = {
//   // function for our authenticated routes
//   authMiddleware: function (req, res, next) {
//     // allows token to be sent via  req.query or headers
//     let token = req.query.token || req.headers.authorization;

//     // ["Bearer", "<tokenvalue>"]
//     if (req.headers.authorization) {
//       token = token.split(' ').pop().trim();
//     }

//     if (!token) {
//       return res.status(400).json({ message: 'You have no token!' });
//     }

//     // verify token and get user data out of it
//     try {
//       const { data } = jwt.verify(token, secret, { maxAge: expiration });
//       req.user = data;
//     } catch {
//       console.log('Invalid token');
//       return res.status(400).json({ message: 'invalid token!' });
//     }

//     // send to next endpoint
//     next();
//   },
//   signToken: function ({ username, email, _id }) {
//     const payload = { username, email, _id };

//     return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
//   },
// };

// const authMiddleware = (context) => {
//   const authHeader = context.req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split('Bearer ')[1];
//     if (token) {
//       try {
//         const user = jwt.verify(token, secret);
//         return user;
//       } catch (err) {
//         throw new AuthenticationError('Invalid or expired token');
//       }
//     }
//     throw new AuthenticationError('Authentication token must be \'Bearer [token]\'');
//   }
//   throw new AuthenticationError('Authorization header must be provided');
// };

// module.exports = authMiddleware;

// const jwt = require('jsonwebtoken');
// const { AuthenticationError } = require('apollo-server-express');

// // Set token secret and expiration date
// const secret = 'mysecretsshhhhh';
// const expiration = '2h';

// // Middleware for authentication
// const authMiddleware = (context) => {
//   const authHeader = context.req.headers.authorization;

//   if (authHeader && authHeader.startsWith('Bearer ')) {
//     const token = authHeader.split('Bearer ')[1];
//     if (token) {
//       try {
//         const user = jwt.verify(token, secret);
//         return user;
//       } catch (err) {
//         throw new AuthenticationError('Invalid or expired token');
//       }
//     }
//     throw new AuthenticationError('Invalid authentication token format');
//   }
//   throw new AuthenticationError('Authorization header must be provided');
// };


// const signToken = ({ username, email, _id }) => {
//   const payload = { username, email, _id };
//   return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
// };

// module.exports = { authMiddleware, signToken };

const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const secret = 'mysecretssshhhhhhh';
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },

  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
