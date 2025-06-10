'use client';
export const dynamic = 'force-dynamic';
import { PostFeed, PostFeedProps } from '../../components/PostFeed';

const feedProps: PostFeedProps = {
  feedUrl: '/api/posts/feed',
  feedTitle: 'Latest posts:',
  showOnlyCategorySelector: false
}

export default function Feed() {
  return PostFeed(feedProps)
}