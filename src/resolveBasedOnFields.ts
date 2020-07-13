import { GraphQLResolveInfo, GraphQLFieldResolver, FieldNode, SelectionNode } from "graphql";

export default function resolveBasedOnFields(
  fieldResolverGenerator: (fields: readonly FieldNode[]) => GraphQLFieldResolver<any, any>
): GraphQLFieldResolver<any, any> {
  return (root, args, context, info: GraphQLResolveInfo) => {
    const fieldsFromSelectionNode = (nodes: readonly SelectionNode[]): FieldNode[] => {
      const fields: FieldNode[] = [];
      nodes.forEach((field) => {
        if (field.kind === "Field") {
          fields.push(field);
        } else if (field.kind === "FragmentSpread") {
          fields.push(
            ...fieldsFromSelectionNode(info.fragments[field.name.value].selectionSet.selections)
          );
        } else {
          // InlineFragment
          fields.push(...fieldsFromSelectionNode(field.selectionSet.selections));
        }
      });
      return fields;
    };
    const fields = fieldsFromSelectionNode(info.fieldNodes[0].selectionSet?.selections || []);
    return fieldResolverGenerator(fields)(root, args, context, info);
  };
}
