import { memberLoader } from './member.loader.js';
import { postLoader } from './post.loader.js';
import { profileLoader } from './profile.loader.js';
import {
  subscribedToUserLoader,
  userLoader,
  userSubscribedToLoader,
} from './user.loader.js';

export const updateContextWithLoaders = (context) => {
  context.loaders = {
    userLoader: userLoader(context),
    postLoader: postLoader(context),
    profileLoader: profileLoader(context),
    subscribedToUserLoader: subscribedToUserLoader(context),
    userSubscribedToLoader: userSubscribedToLoader(context),
    memberLoader: memberLoader(context),
  };
  return context;
};
