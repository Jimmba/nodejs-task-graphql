import { GraphQLBoolean, GraphQLInputObjectType, GraphQLString } from 'graphql';
import { postType } from '../queries/posts.query.js';
import { UUIDType } from '../types/uuid.js';
import { isRequestSuccessful } from '../../helpers/is-request-successful.helper.js';

const createPostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    authorId: {
      type: UUIDType,
    },
  }),
});

const changePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  }),
});

export const postMutation = {
  createPost: {
    type: postType,
    args: {
      dto: {
        type: createPostInput,
      },
    },
    resolve: async (obj, args, context) => {
      const { dto } = args;
      return await context.prisma.post.create({ data: dto });
    },
  },
  deletePost: {
    type: GraphQLBoolean,
    args: {
      id: {
        type: UUIDType,
      },
    },
    resolve: async (obj, args, context) => {
      const { id } = args;
      const cb = context.prisma.post.delete({
        where: {
          id,
        },
      });
      return await isRequestSuccessful(cb);
    },
  },
  changePost: {
    type: postType,
    args: {
      id: {
        type: UUIDType,
      },
      dto: {
        type: changePostInput,
      },
    },
    resolve: async (obj, args, context) => {
      const { id, dto: data } = args;
      return await context.prisma.post.update({
        where: {
          id,
        },
        data,
      });
    },
  },
};
