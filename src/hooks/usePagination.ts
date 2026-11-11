import { useState } from 'react';

const DEFAULT_PAGE_SIZE = 10;

function usePagination<T>(items: T[], pageSize: number = DEFAULT_PAGE_SIZE) {
  const [pages, setPages] = useState(1);
  const visibleItems = items.slice(0, pages * pageSize);
  const hasMore = items.length > visibleItems.length;

  const loadMore = () => setPages((value) => value + 1);

  return { visibleItems, hasMore, loadMore };
}

export default usePagination;