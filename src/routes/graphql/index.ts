import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import { queries } from './queries/main.query.js';
import { mutations } from './mutations/main.mutation.js';
import depthLimit from 'graphql-depth-limit';
import { updateContextWithLoaders } from './loaders/main.loader.js';

const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req, reply) {
      const { query: source, variables: variableValues } = req.body;

      const schema = new GraphQLSchema({
        query: queries,
        mutation: mutations,
      });

      const validationErrors = validate(schema, parse(source), [depthLimit(DEPTH_LIMIT)]);

      if (validationErrors.length > 0) {
        return reply.status(400).send({ errors: validationErrors });
      }

      return graphql({
        schema,
        source,
        variableValues,
        contextValue: updateContextWithLoaders({ prisma }),
      });
    },
  });
};

export default plugin;
