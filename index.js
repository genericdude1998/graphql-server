const { ApolloServer, gql } = require("apollo-server");
const { query } = require("./db");

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
    deleteCourse(name: String): Boolean
    updateCourse(input: UpdateCourseInput): Course
  }
`;

const resolvers = {
  Query: {
    welcome: (_, __, context) => {
      return `Welcome to ${context.country}`;
    },
    course: async (_, { name }) => {
      return (await query(`SELECT * from courses WHERE name="${name}"`))[0];
    },
    courses: async () => {
      return await query(`SELECT * from courses`);
    },
  },
  Mutation: {
    addCourse: async (_, { input: { name, price } }) => {
      console.log("Creating", name);
      const newCourse = { name, price };
      await query(
        `INSERT INTO courses (name, price) VALUES ('${name}', ${price})`
      );

      return newCourse;
    },

    updateCourse: (parent, { input: { name, price } }, { courses }) => {
      console.log("Updating", { name, price });
      const courseToUpdate = courses.find((c) => c.name === name);
      courseToUpdate.price = price;
      return courseToUpdate;
    },
    deleteCourse: (parent, { name }) => {
      console.log("Deleting", name);
      query(`DELETE FROM courses WHERE name="${name}"`);
      return true;
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
