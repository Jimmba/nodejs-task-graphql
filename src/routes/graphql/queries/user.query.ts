import { GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from '../types/uuid.js';

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});

export const userQuery = {
  users: {
    type: new GraphQLList(userType),
    resolve: async (obj, args, context) => {
      return await context.prisma.user.findMany();
    },
  },
};
