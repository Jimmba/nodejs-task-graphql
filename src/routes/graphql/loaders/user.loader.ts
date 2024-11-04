import DataLoader from 'dataloader';

export const userLoader = (context) => {
  return new DataLoader(async (userIds) => {
    const users = await context.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
    const userMap = users.reduce((map, user) => {
      const { id } = user;
      map[id] = user;
      return map;
    }, {});
    console.log('cache', userMap);
    return userIds.map((id) => userMap[id as string] || null);
  });
};

export const subscribedToUserLoader = (context) => {
  return new DataLoader(async (userIds) => {
    const users = await context.prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: {
              in: userIds,
            },
          },
        },
      },
      include: { subscribedToUser: true, userSubscribedTo: true },
    });

    const userMap = users.reduce((map, user) => {
      const userSubscribedToArray = user.userSubscribedTo;
      for (let i = 0; i < userSubscribedToArray.length; i += 1) {
        const { authorId } = userSubscribedToArray[i];
        if (!map[authorId]) map[authorId] = [];
        map[authorId].push(user);
      }
      return map;
    }, {});
    return userIds.map((id) => {
      return userMap[id as string] || [];
    });
  });
};

export const userSubscribedToLoader = (context) => {
  return new DataLoader(async (userIds) => {
    const users = await context.prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: {
              in: userIds,
            },
          },
        },
      },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });
    const userMap = users.reduce((map, user) => {
      const subscribedToUserArray = user.subscribedToUser;
      for (let i = 0; i < subscribedToUserArray.length; i += 1) {
        const { subscriberId } = subscribedToUserArray[i];
        if (!map[subscriberId]) map[subscriberId] = [];
        map[subscriberId].push(user);
      }
      return map;
    }, {});
    return userIds.map((id) => {
      return userMap[id as string] || [];
    });
  });
};
