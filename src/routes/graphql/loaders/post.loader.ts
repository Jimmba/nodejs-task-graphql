import DataLoader from 'dataloader';

export const postLoader = (context) => {
  return new DataLoader(async (authorIds) => {
    const posts = await context.prisma.post.findMany({
      where: {
        authorId: {
          in: authorIds,
        },
      },
    });
    const postMap = posts.reduce((map, post) => {
      const { authorId } = post;
      if (!map[authorId]) map[authorId] = [];
      map[authorId].push(post);
      return map;
    }, {});
    return authorIds.map((id) => {
      return postMap[id as string] || [];
    });
  });
};
