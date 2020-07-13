import { makeExecutableSchema } from "@graphql-tools/schema";

export const typeDefs = /* GraphQL */ `
  type Employee {
    id: ID!
    name: String!
  }

  type VideoStore {
    id: ID!
    employees: [Employee!]!
    manager: Employee!
  }

  type Query {
    videostore: VideoStore
  }

  schema {
    query: Query
  }
`;

export const employeesData = {
  e1: { id: "e1", name: "Buffy Summers" },
  e2: { id: "e2", name: "Willow Rosenberg" },
  e3: { id: "e3", name: "Xander Harris" },
  m1: { id: "m1", name: "Rupert Giles" },
};

export const videostoreData = {
  id: "123",
  employeeIds: ["e1", "e2", "e3"],
  managerId: "m1",
};
