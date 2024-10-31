import { GraphQLObjectType } from 'graphql';
import { userMutation } from './user.mutation.js';
import { postMutation } from './post.mutation.js';
import { profileMutation } from './profile.mutation.js';

export const mutations = new GraphQLObjectType({
  name: 'mutations',
  fields: () => ({
    ...postMutation,
    ...profileMutation,
    ...userMutation,
  }),
});
