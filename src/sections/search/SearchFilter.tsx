import { FC, ReactNode } from 'react';

import FundraisingFilter from './Fundraising/FundraisingFilter';
import { searchTabs } from './SearchMain';
import NgoFilter from './ngo/NgoFilter';
import PeopleSidebar from './people/PeopleSidebar';
import PostFilter from './post/PostFilter';

const SearchFilter: FC<{ searchType: searchTabs }> = ({ searchType }) => {
  const searchedFilters: Record<string, ReactNode> = {
    Fundraising: <FundraisingFilter />,
    Ngo: <NgoFilter />,
    People: <PeopleSidebar />,
    Post: <PostFilter />,
  };

  const conditionalRendering = (type: searchTabs) => searchedFilters[type];

  return <>{conditionalRendering(searchType)}</>;
};

export default SearchFilter;
