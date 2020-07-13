import { makeExecutableSchema } from "@graphql-tools/schema";
import { parse, execute } from "graphql";
import { typeDefs, employeesData, videostoreData } from "./schema";
import resolveBasedOnFields from "../resolveBasedOnFields";

describe("resolveBasedOnFields", () => {
  test("should be called with a list of fields and accept a resolver as return value", () => {
    const spy = jest.fn();
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Query: {
          videostore: () => videostoreData,
        },
        VideoStore: {
          manager: resolveBasedOnFields((fields) => {
            spy(fields);
            if (fields.length === 1) {
              return (root) => employeesData["e1"];
            }
            return (root) => employeesData[root.managerId];
          }),
        },
      },
    });
    const resp = execute({
      schema,
      document: parse(/* GraphQL */ `
        query {
          videostore {
            manager {
              id
            }
          }
        }
      `),
      rootValue: {},
      contextValue: {},
    });
    const resp2 = execute({
      schema,
      document: parse(/* GraphQL */ `
        query {
          videostore {
            manager {
              id
              name
            }
          }
        }
      `),
      rootValue: {},
      contextValue: {},
    });

    expect(resp).toEqual({ data: { videostore: { manager: { id: "e1" } } } });
    expect(resp2).toEqual({
      data: { videostore: { manager: { id: "m1", name: "Rupert Giles" } } },
    });
    expect(spy.mock.calls[0][0]).toHaveLength(1);
    expect(spy.mock.calls[0][0][0]).toMatchObject({ kind: "Field", name: { value: "id" } });
  });

  test("flattens the fields of a fragment spread", () => {
    const spy = jest.fn();
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Query: {
          videostore: () => videostoreData,
        },
        VideoStore: {
          manager: resolveBasedOnFields((fields) => {
            spy(fields);
            return (root) => employeesData[root.managerId];
          }),
        },
      },
    });
    const resp = execute({
      schema,
      document: parse(/* GraphQL */ `
        fragment ManagerFrag on Employee {
          id
          name
        }
        query {
          videostore {
            manager {
              ...ManagerFrag
            }
          }
        }
      `),
      rootValue: {},
      contextValue: {},
    });

    expect(resp).toEqual({ data: { videostore: { manager: { id: "m1", name: "Rupert Giles" } } } });
    expect(spy.mock.calls[0][0]).toHaveLength(2);
    expect(spy.mock.calls[0][0]).toMatchObject([
      { kind: "Field", name: { value: "id" } },
      { kind: "Field", name: { value: "name" } },
    ]);
  });

  test("flattens the fields of an inline fragment", () => {
    const spy = jest.fn();
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Query: {
          videostore: () => videostoreData,
        },
        VideoStore: {
          manager: resolveBasedOnFields((fields) => {
            spy(fields);
            return (root) => employeesData[root.managerId];
          }),
        },
      },
    });
    const resp = execute({
      schema,
      document: parse(/* GraphQL */ `
        query {
          videostore {
            manager {
              ... on Employee {
                id
                name
              }
            }
          }
        }
      `),
      rootValue: {},
      contextValue: {},
    });

    expect(resp).toEqual({ data: { videostore: { manager: { id: "m1", name: "Rupert Giles" } } } });
    expect(spy.mock.calls[0][0]).toHaveLength(2);
    expect(spy.mock.calls[0][0]).toMatchObject([
      { kind: "Field", name: { value: "id" } },
      { kind: "Field", name: { value: "name" } },
    ]);
  });

  test("works on a list-based field", () => {
    const spy = jest.fn();
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Query: {
          videostore: () => videostoreData,
        },
        VideoStore: {
          employees: resolveBasedOnFields((fields) => {
            spy(fields);
            return (root) => root.employeeIds.map((k) => employeesData[k]);
          }),
        },
      },
    });
    const resp = execute({
      schema,
      document: parse(/* GraphQL */ `
        fragment EmployeeFrag on Employee {
          id
          name
        }
        query {
          videostore {
            employees {
              ...EmployeeFrag
            }
          }
        }
      `),
      rootValue: {},
      contextValue: {},
    });

    expect(resp).toEqual({
      data: {
        videostore: {
          employees: [
            { id: "e1", name: "Buffy Summers" },
            { id: "e2", name: "Willow Rosenberg" },
            { id: "e3", name: "Xander Harris" },
          ],
        },
      },
    });
    expect(spy.mock.calls[0][0]).toHaveLength(2);
    expect(spy.mock.calls[0][0]).toMatchObject([
      { kind: "Field", name: { value: "id" } },
      { kind: "Field", name: { value: "name" } },
    ]);
  });
});
