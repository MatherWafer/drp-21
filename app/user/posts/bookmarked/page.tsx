'use client';
export const dynamic = 'force-dynamic';
import useSWR from 'swr';
import { useFiltered } from '../FilterContext';
import Selector from '../../../layout/Selector';
import PostStream from '../PostStream';
import { PostInfo } from '../PostOverview';
import { PostFeed, PostFeedProps } from '../../../../components/PostFeed';

const bookmarkedProps: PostFeedProps = {
  feedUrl: '/api/posts/bookmarked',
  feedTitle: 'Your bookmarked posts:',
  showOnlyCategorySelector: false
}

export default function BookmarkedFeed() {
  return PostFeed(bookmarkedProps)
}
