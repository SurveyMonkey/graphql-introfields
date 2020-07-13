import { GraphQLFieldResolver } from "graphql";
import resolveBasedOnFields from "./resolveBasedOnFields";

export default function resolveIDFieldFromRoot<TSource = any, TContext = any>(
  fieldNameOnParent: string,
  alternateResolver: GraphQLFieldResolver<TSource, TContext>,
  defaultIdField: string = "id"
): GraphQLFieldResolver<TSource, TContext> {
  return resolveBasedOnFields((fields) => {
    return fields.length === 1 && fields[0].name.value === defaultIdField
      ? (root, _args, _ctx, _info) => {
          return { id: root[fieldNameOnParent] };
        }
      : alternateResolver;
  });
}
