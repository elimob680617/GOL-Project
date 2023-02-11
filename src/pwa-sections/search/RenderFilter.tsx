import { FC } from 'react';

import { searchTabs } from 'src/sections/search/SearchMain';

import FundraisingFilter from './Fundraising/FundraisingFilter';
import NgoFilter from './ngo/NgoFilter';
import PeopleSidebar from './people/PeopleSidebar';
import PostFilter from './post/PostFilter';

const RenderFilter: FC<{ activeFilter: searchTabs }> = ({ activeFilter }) => {
  const searchedFilters = {
    Fundraising: <FundraisingFilter />,
    Ngo: <NgoFilter />,
    People: <PeopleSidebar />,
    Post: <PostFilter />,
  };

  const conditionalRendering = (type: searchTabs) => searchedFilters[type as keyof typeof searchedFilters];

  return <>{conditionalRendering(activeFilter)}</>;
};

export default RenderFilter;
