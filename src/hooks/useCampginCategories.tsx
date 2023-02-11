import { useEffect, useMemo } from 'react';

import { useLazyGetCampaignCategoriesQueryQuery } from 'src/_graphql/post/campaign-post/queries/getCampaignCategoriesQuery.generated';

const useCampgingCategories = () => {
  const [camapginCategoryRequest, { data: camapginCategories }] = useLazyGetCampaignCategoriesQueryQuery();

  useEffect(() => {
    camapginCategoryRequest({ filter: { all: true } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(() => camapginCategories, [camapginCategories]);
};

export default useCampgingCategories;
