import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { profileType } from './profiles.query.js';
import { postType } from './posts.query.js';

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: profileType,
      resolve: async (user, args, context) => {
        return await context.prisma.profile.findUnique({
          where: { userId: user.id },
        });
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (user, args, context) => {
        return await context.prisma.post.findMany({
          where: { authorId: user.id },
        });
      },
    },
    // userSubscribedTo: {
    //   type: userType,
    //   resolve: async (user, args, context) => {
    //     return await context.prisma.post.findMany({
    //       where: { authorId: user.id },
    //     });
    //   },
    // }
  }),
});

export const userQuery = {
  users: {
    type: new GraphQLList(userType),
    resolve: async (obj, args, context) => {
      return await context.prisma.user.findMany();
    },
  },
  user: {
    type: userType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { id } = args;
      const user = await context.prisma.user.findUnique({
        where: { id },
      });
      return user || null;
    },
  },
};
