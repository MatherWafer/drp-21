'use client';

import { PostFeed, PostFeedProps } from "../../../../components/PostFeed";

export const dynamic = 'force-dynamic';

const feedProps: PostFeedProps = {
  feedUrl: '/api/posts/ownPosts',
  feedTitle: 'Your Posts:',
  showOnlyCategorySelector: true
}

export default function OwnPostsFeed() {
  return PostFeed(feedProps)
}