import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
} from 'graphql';
import { profileType } from '../queries/profiles.query.js';
import { UUIDType } from '../types/uuid.js';
import { memberTypeId } from '../queries/member.query.js';
import { isRequestSuccessful } from '../../helpers/is-request-successful.helper.js';

const createProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: {
      type: UUIDType,
    },
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});

const changeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    memberTypeId: {
      type: memberTypeId,
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
  }),
});

export const profileMutation = {
  createProfile: {
    type: profileType,
    args: {
      dto: {
        type: createProfileInput,
      },
    },
    resolve: async (obj, args, context) => {
      const { dto } = args;
      return await context.prisma.profile.create({ data: dto });
    },
  },
  deleteProfile: {
    type: GraphQLBoolean,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { id } = args;
      const cb = context.prisma.profile.delete({
        where: {
          id,
        },
      });
      return await isRequestSuccessful(cb);
    },
  },
  changeProfile: {
    type: profileType,
    args: {
      id: {
        type: UUIDType,
      },
      dto: {
        type: changeProfileInput,
      },
    },
    resolve: async (obj, args, context) => {
      const { id, dto: data } = args;
      return await context.prisma.profile.update({
        where: {
          id,
        },
        data,
      });
    },
  },
};
