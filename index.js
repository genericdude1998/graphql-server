const { ApolloServer, gql } = require("apollo-server");

const courses = [
  { name: "Graph", price: 10 },
  { name: "React", price: 15 },
];

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

  input AddCourseInput {
    name: String!
    price: Float!
  }

  input UpdateCourseInput {
    name: String!
    price: Float!
  }

  type Mutation {
    addCourse(input: AddCourseInput): Course
    deleteCourse(name: String): [Course]
    updateCourse(input: UpdateCourseInput): Course
  }
`;

const resolvers = {
  Query: {
    welcome: (_, __, context) => {
      return `Welcome to ${context.country}`;
    },
    course: (parent, args, { courses }) => {
      return courses.find((c) => c.name === args.name);
    },
    courses: (_, __, { courses }) => {
      return courses;
    },
  },
  Mutation: {
    addCourse: (parent, { input: { name, price } }, { courses }) => {
      console.log("Creating", name);
      console.log({ name, price });
      courses.push({ name, price });
      return { name, price };
    },

    updateCourse: (parent, { input: { name, price } }, { courses }) => {
      console.log("Updating", { name, price });
      const courseToUpdate = courses.find((c) => c.name === name);
      courseToUpdate.price = price;
      return courseToUpdate;
    },
    deleteCourse: (parent, { name }, { courses }) => {
      console.log("Deleting", name);
      courses = courses.filter((course) => course.name !== name);
      courses.pop();
      return courses;
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    country: "US",
    courses,
  },
});
server.listen().then(({ url }) => console.log(`Server is running at ${url}`));
