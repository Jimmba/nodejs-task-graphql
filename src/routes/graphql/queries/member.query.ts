import { GraphQLEnumType, GraphQLFloat, GraphQLList, GraphQLObjectType } from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';

export const memberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: MemberTypeId.BASIC },
    BUSINESS: { value: MemberTypeId.BUSINESS },
  },
});

export const memberType = new GraphQLObjectType({
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
    type: new GraphQLList(memberType),
    resolve: async (obj, args, context) => {
      return await context.prisma.memberType.findMany();
    },
  },
  memberType: {
    type: memberType,
    args: {
      id: {
        type: memberTypeId,
      },
    },
    resolve: async (obj, args, context) => {
      const { id } = args;
      return await context.prisma.memberType.findUnique({
        where: { id },
      });
    },
  },
};
