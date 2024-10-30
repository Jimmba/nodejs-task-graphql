import { GraphQLObjectType } from 'graphql';
import { memberQuery } from './member.query.js';
import { postQuery } from './posts.query.js';
import { profileQuery } from './profiles.query.js';
import { userQuery } from './user.query.js';

export const queries = new GraphQLObjectType({
  name: 'queries',
  fields: () => ({
    ...memberQuery,
    ...postQuery,
    ...profileQuery,
    ...userQuery,
  }),
});
