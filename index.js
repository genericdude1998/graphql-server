const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    welcome: String
    numberOfPeople: Int
    courses: [Course]
    course(name: String): Course
  }

  type Course {
    name: String!
    price: Float!
  }
`;

const resolvers = {
  Query: {
    welcome: (_, __, context) => {
      return `Welcome to ${context.country}`;
    },
    course: (parent, args, context) => {
      return [
        { name: "Graph", price: 10 },
        { name: "React", price: 15 },
      ].find((c) => c.name === args.name);
    },
    courses: () => {
      return [
        { name: "Graph", price: 10 },
        { name: "React", price: 15 },
      ];
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { country: "US" },
});
server.listen().then(({ url }) => console.log(`Server is running at ${url}`));
