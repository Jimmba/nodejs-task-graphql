import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { memberType, memberTypeId } from './member.query.js';

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    userId: {
      type: UUIDType,
    },
    memberType: {
      type: memberType,
      resolve: async (profile, arts, context) => {
        return await context.loaders.memberLoader.load(profile.memberTypeId);
      },
    },
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
