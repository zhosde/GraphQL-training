// resolve subscriptions and push the event data
function newLinkSubscribe(parent, args, context, info) {
  // access pubsub on the context and call asyncIterator() passing the string "NEW_LINK" into it
  return context.pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscribe,
  // returns the data from the data emitted by the AsyncIterator
  resolve: (payload) => {
    return payload;
  },
};

function newVoteSubscribe(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_VOTE");
}

const newVote = {
  subscribe: newVoteSubscribe,
  resolve: (payload) => {
    return payload;
  },
};

module.exports = {
  newLink,
  newVote,
};
