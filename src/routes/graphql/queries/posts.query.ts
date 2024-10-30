import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';

const postTypes = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});

export const postQuery = {
  posts: {
    type: new GraphQLList(postTypes),
    resolve: async (obj, args, context) => {
      return await context.prisma.post.findMany();
    },
  },
};
