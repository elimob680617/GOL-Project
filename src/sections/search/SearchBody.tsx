import { FC, ReactNode } from 'react';

import FundraisingSearch from './Fundraising/FundraisingSearch';
import { searchTabs } from './SearchMain';
import { SearchWrapper } from './SharedStyled';
import AllSearch from './all/AllSearch';
import HashtagSearch from './hashtag/HashtagSearch';
import NgoSearch from './ngo/NgoSearch';
import PeopleSearch from './people/PeopleSearch';
import PostSearch from './post/PostSearch';

const SearchBody: FC<{ searchType: searchTabs; nextPage: () => void }> = ({ searchType, nextPage }) => {
  const searchedBodies: Record<string, ReactNode> = {
    Fundraising: <FundraisingSearch nextPage={nextPage} />,
    Hashtags: <HashtagSearch nextPage={nextPage} />,
    Ngo: <NgoSearch nextPage={nextPage} />,
    People: <PeopleSearch nextPage={nextPage} />,
    Post: <PostSearch nextPage={nextPage} />,
    All: <AllSearch />,
  };

  const conditionalRendering = (type: searchTabs) => searchedBodies[type];

  return <SearchWrapper spacing={2}>{conditionalRendering(searchType)}</SearchWrapper>;
};

export default SearchBody;
