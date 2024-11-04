import DataLoader from 'dataloader';

export const profileLoader = (context) => {
  return new DataLoader(async (userIds) => {
    const profiles = await context.prisma.profile.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });
    const profileMap = profiles.reduce((map, profile) => {
      const { userId } = profile;
      map[userId] = profile;
      return map;
    }, {});

    return userIds.map((id) => {
      return profileMap[id as string] || null;
    });
  });
};
