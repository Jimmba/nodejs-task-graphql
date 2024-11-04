export const isRequestSuccessful = async (cb) => {
  try {
    await cb;
    return true;
  } catch (e) {
    return false;
  }
};
