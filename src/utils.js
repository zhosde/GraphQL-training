// create a few utilities that are being reused in a few places
const jwt = require("jsonwebtoken");
const APP_SECRET = "GraphQL-is-aw3some";

function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

// a helper function be used in resolvers that require authentication
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
