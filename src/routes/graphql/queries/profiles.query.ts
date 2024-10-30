import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { memberTypeId } from './member.query.js';

const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: UUIDType,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    // userId: {
    //   type: UUIDType,
    // },
    // memberTypeId: {
    //   type: memberTypeId,
    // },
  }),
});

export const profileQuery = {
  profiles: {
    type: new GraphQLList(profileType),
    resolve: async (obj, args, context) => {
      return context.prisma.profile.findMany();
    },
  },
  profile: {
    type: profileType,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { id } = args;
      return await context.prisma.profile.findUnique({
        where: { id },
      });
    },
  },
};
