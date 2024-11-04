import DataLoader from 'dataloader';

export const memberLoader = (context) => {
  return new DataLoader(async (memberIds) => {
    const members = await context.prisma.memberType.findMany({
      where: {
        id: {
          in: memberIds,
        },
      },
    });
    const memberMap = members.reduce((map, member) => {
      const { id } = member;
      map[id] = member;
      return map;
    }, {});
    return memberIds.map((id) => memberMap[id as string] || null);
  });
};
