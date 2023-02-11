import { FC, ReactNode } from 'react';

import FundraisingSearch from './Fundraising/FundraisingSearch';
import SearchItemsLayout from './SearchItemsLayout';
import { searchTabs } from './SearchMain';
import AllSearch from './all/AllSearch';
import HashtagSearch from './hashtag/HashtagSearch';
import NgoSearch from './ngo/NgoSearch';
import PeopleSearch from './people/PeopleSearch';
import PostSearch from './post/PostSearch';

const SearchBody: FC<{ searchType: searchTabs; nextPage: () => void }> = ({ nextPage, searchType }) => {
  const searchedBodies: Record<string, ReactNode> = {
    Fundraising: <FundraisingSearch nextPage={nextPage} />,
    Hashtags: <HashtagSearch nextPage={nextPage} />,
    Ngo: <NgoSearch nextPage={nextPage} />,
    People: <PeopleSearch nextPage={nextPage} />,
    Post: <PostSearch nextPage={nextPage} />,
    All: <AllSearch />,
  };

  const conditionalRendering = (type: searchTabs) => searchedBodies[type];

  return <SearchItemsLayout>{conditionalRendering(searchType)}</SearchItemsLayout>;
};

export default SearchBody;
