import { GraphQLEnumType, GraphQLFloat, GraphQLList, GraphQLObjectType } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

export const memberTypes = new GraphQLObjectType({
  name: 'MemberType',
  fields: () => ({
    id: {
      type: memberTypeId,
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLFloat,
    },
  }),
});

export const memberQuery = {
  memberTypes: {
    type: new GraphQLList(memberTypes),
    resolve: async (obj, args, context) => {
      return await context.prisma.memberType.findMany();
    },
  },
};
