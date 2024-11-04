import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql';
import { userType } from '../queries/user.query.js';
import { UUIDType } from '../types/uuid.js';
import { isRequestSuccessful } from '../../helpers/is-request-successful.helper.js';

const createUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});

const changeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  }),
});

export const userMutation = {
  createUser: {
    type: userType,
    args: {
      dto: {
        type: createUserInput,
      },
    },
    resolve: async (obj, args, context) => {
      const { dto } = args;
      return await context.prisma.user.create({ data: dto });
    },
  },
  deleteUser: {
    type: GraphQLBoolean,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { id } = args;
      const cb = context.prisma.user.delete({
        where: {
          id,
        },
      });
      return await isRequestSuccessful(cb);
    },
  },
  changeUser: {
    type: userType,
    args: {
      id: {
        type: UUIDType,
      },
      dto: {
        type: changeUserInput,
      },
    },
    resolve: async (obj, args, context) => {
      const { id, dto: data } = args;
      return await context.prisma.user.update({
        where: {
          id,
        },
        data,
      });
    },
  },
  subscribeTo: {
    type: GraphQLBoolean,
    args: {
      userId: {
        type: UUIDType,
      },
      authorId: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { userId, authorId } = args;
      const cb = context.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          userSubscribedTo: {
            create: {
              authorId,
            },
          },
        },
      });
      return await isRequestSuccessful(cb);
    },
  },
  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: {
        type: UUIDType,
      },
      authorId: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { userId, authorId } = args;

      const cb = context.prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId: authorId,
          },
        },
      });
      return await isRequestSuccessful(cb);
    },
  },
};
