import { makeExecutableSchema } from "@graphql-tools/schema";
import { parse, execute } from "graphql";
import { typeDefs, employeesData, videostoreData } from "./schema";
import resolveIDFieldFromRoot from "../resolveIDFieldFromRoot";

describe("resolveIDFieldFromRoot", () => {
  test("should not call the alternate resolver if only one field is asked for", () => {
    const spy = jest.fn();
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Query: {
          videostore: () => videostoreData,
        },
        VideoStore: {
          manager: resolveIDFieldFromRoot("managerId", (root) => {
            spy(root);
            return employeesData["m1"];
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

    expect(resp).toEqual({ data: { videostore: { manager: { id: "m1" } } } });
    expect(spy).not.toHaveBeenCalled();
  });

  test("should call the alternate resolver if more than one fields are asked for", () => {
    const spy = jest.fn();
    const schema = makeExecutableSchema({
      typeDefs,
      resolvers: {
        Query: {
          videostore: () => videostoreData,
        },
        VideoStore: {
          manager: resolveIDFieldFromRoot("managerId", (root) => {
            spy(root);
            return employeesData["m1"];
          }),
        },
      },
    });
    const resp = execute({
      schema,
      document: parse(/* GraphQL */ `
        fragment EmpFrag on Employee {
          id
          name
        }
        query {
          videostore {
            manager {
              ...EmpFrag
            }
          }
        }
      `),
      rootValue: {},
      contextValue: {},
    });

    expect(resp).toEqual({ data: { videostore: { manager: { id: "m1", name: "Rupert Giles" } } } });
    expect(spy).toHaveBeenCalledWith({
      employeeIds: ["e1", "e2", "e3"],
      id: "123",
      managerId: "m1",
    });
  });
});
