import { GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';

const postType = new GraphQLObjectType({
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
    type: new GraphQLList(postType),
    resolve: async (obj, args, context) => {
      return await context.prisma.post.findMany();
    },
  },
  post: {
    type: postType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { id } = args;
      return await context.prisma.post.findUnique({
        where: { id },
      });
    },
  },
};
