/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';

import { useLazyGetFundRaisingPostsQuery } from 'src/_graphql/post/campaign-post/queries/getCampaignPosts.generated';
import { useLazyGetHomePageSocialPostsQuery } from 'src/_graphql/post/getHomePageSocialPost.generated';
import { useLazySearchAllQuery } from 'src/_graphql/search/queries/allSearch.generated';
import { useLazyGetCampaginPostSearchQuery } from 'src/_graphql/search/queries/getCampaginPostSearch.generated';
import { useLazyGetHashtagSearchQuery } from 'src/_graphql/search/queries/getHashtagSearch.generated';
import { useLazyGetNgoSearchQuery } from 'src/_graphql/search/queries/getNgoSearch.generated';
import { useLazyGetPeopleSearchQuery } from 'src/_graphql/search/queries/getPeopleSearch.generated';
import { useLazyGetSocialSearchQuery } from 'src/_graphql/search/queries/getSocialPostSearch.generated';
import { useDispatch, useSelector } from 'src/store';
import { getSearchedValues, setCount, setLoading, setValues, updateValues } from 'src/store/slices/search';
import { CreationDateEnum, PostStatus, SearchCategoryEnumType } from 'src/types/serverTypes';

import { PwaSearchSubjectsFuncs } from './PwaSearchSubjects';
import { searchTabs } from './SearchMain';

const useSearch = (searchType: searchTabs | null, pageIndex: number, canSendRequest: boolean) => {
  const pageSize = 20;
  const needToReset = useRef<boolean>(false);
  const dispatch = useDispatch();
  const filters = useSelector(getSearchedValues);
  const [getPeople, { isFetching: gettingPeopleLoading }] = useLazyGetPeopleSearchQuery();
  const [getCampaignPosts, { isFetching: getCampaignPostsLoading }] = useLazyGetCampaginPostSearchQuery();
  const [getCampaginPostFromPostServer, { isFetching: gettingCampaginPostFromPostServerLoading }] =
    useLazyGetFundRaisingPostsQuery();
  const [getHashtags, { isFetching: gettingHashtagsLoading }] = useLazyGetHashtagSearchQuery();
  const [getNgo, { isFetching: gettingNgoLoading }] = useLazyGetNgoSearchQuery();
  const [getSocialPosts, { isFetching: gettingSocialPostsLoading }] = useLazyGetSocialSearchQuery();
  const [getSocialPostsFromPostServer, { isFetching: getttingSocialPostsFromPostServerLoading }] =
    useLazyGetHomePageSocialPostsQuery();

  const [getAll, { isFetching: gettingAllLoading }] = useLazySearchAllQuery();

  useEffect(() => {
    if (canSendRequest) {
      needToReset.current = true;
      sendRequest(true);
    }
  }, [canSendRequest]);

  useEffect(() => {
    if (pageIndex !== 1 && canSendRequest) {
      needToReset.current = false;
      sendRequest();
    }
  }, [pageIndex]);

  useEffect(() => {
    const getFilterChangedSubscriber = PwaSearchSubjectsFuncs.getFilterChanged().subscribe((res) => {
      if (canSendRequest) {
        needToReset.current = true;
        sendRequest(true);
      }
    });

    return () => {
      getFilterChangedSubscriber.unsubscribe();
    };
  }, []);

  const getPostsRequest = async (newPageIndex: number) => {
    const company = filters.companyWorkeds.map((i) => i.id);
    const searchText = filters.searchedText;
    const creationTime = (filters.sortBy as CreationDateEnum) || CreationDateEnum.All;
    const postedBy = filters.peoples.map((i) => i.id);

    const resIds = await getSocialPosts({
      filter: {
        dto: { company, creationTime, postedBy, searchText },
        pageIndex: newPageIndex,
        pageSize,
      },
    });
    const ids = resIds?.data?.postSearchQueryHandler?.listDto?.items?.map((i) => i!.id);
    if (!ids || !ids!.length) return;
    dispatch(setCount(resIds.data?.postSearchQueryHandler?.listDto!.count));

    getSocialPostsFromPostServer({ filter: { ids, pageIndex: 0, pageSize: pageSize } })
      .unwrap()
      .then((res) => {
        if (needToReset.current) {
          dispatch(setValues({ searchTab: 'Post', data: res!.getHomePageSocialPosts!.listDto!.items! }));
        } else {
          dispatch(updateValues({ data: res!.getHomePageSocialPosts!.listDto!.items!, searchTab: 'Post' }));
        }
      });
  };

  const getCampaginPostsRequest = async (newPageIndex: number) => {
    const location = filters.locations.map((i) => i.id!);
    const searchText = filters.searchedText;
    const creationTime = (filters.sortBy as CreationDateEnum) || CreationDateEnum.All;
    const fundraisingCategory = filters.fundraisingCategory as SearchCategoryEnumType[];
    const ngo = filters.ngos.map((i) => i.id);

    const resIds = await getCampaignPosts({
      filter: {
        dto: { creationTime, categories: fundraisingCategory, location, ngo, searchText },
        pageIndex: newPageIndex,
        pageSize,
      },
    });

    const ids = resIds.data?.fundRaisingSearchQueryHandler?.listDto?.items?.map((i) => i?.id);

    if (!ids!.length) {
      return;
    }

    dispatch(setCount(resIds.data?.fundRaisingSearchQueryHandler?.listDto!.count));

    getCampaginPostFromPostServer({ filter: { ids, pageSize, pageIndex: 0, dto: { status: PostStatus.Show } } })
      .unwrap()
      .then((res) => {
        if (needToReset.current) {
          dispatch(setValues({ searchTab: 'Fundraising', data: res!.getHomePageFundRaisingPosts!.listDto!.items! }));
        } else {
          dispatch(updateValues({ data: res!.getHomePageFundRaisingPosts!.listDto!.items!, searchTab: 'Fundraising' }));
        }
      });
  };

  const sendRequest = async (restart?: boolean) => {
    const college = filters.colleges.map((i) => i.id!);
    const companyWorked = filters.companyWorkeds.map((i) => i.id);
    const location = filters.locations.map((i) => i.id!);
    const searchText = filters.searchedText;
    const skills = filters.skills.map((i) => i.id!);
    const university = filters.universities.map((i) => i.id!);
    const industry = filters.industries.map((i) => i.id);
    const ngoSize = filters.ngoSize;
    let newPageIndex = pageIndex;
    if (restart) {
      newPageIndex = 1;
    }
    switch (searchType) {
      case 'Post':
        getPostsRequest(newPageIndex);
        break;
      case 'Fundraising':
        getCampaginPostsRequest(newPageIndex);
        break;
      case 'Hashtags':
        const hashtags = await getHashtags({
          filter: { dto: { searchText: filters.searchedText }, pageIndex: newPageIndex, pageSize },
        });
        addToReduxValues(
          'Hashtags',
          hashtags!.data!.hashtagSearchQueryHandler!.listDto!.items!,
          hashtags!.data!.hashtagSearchQueryHandler!.listDto!.count,
        );
        break;
      case 'Ngo':
        const ngos = await getNgo({
          filter: { dto: { industry, location, ngoSize, searchText }, pageIndex: newPageIndex, pageSize },
        });
        addToReduxValues(
          'Ngo',
          ngos!.data!.ngoSearchQueryHandler!.listDto!.items!,
          ngos!.data!.ngoSearchQueryHandler!.listDto!.count,
        );
        break;
      case 'People':
        const people = await getPeople({
          filter: {
            dto: { college, companyWorked, location, searchText, skills, university },
            pageIndex: newPageIndex,
            pageSize,
          },
        });
        addToReduxValues(
          'People',
          people!.data!.peopleSearchQueryHandler!.listDto!.items!,
          people!.data!.peopleSearchQueryHandler!.listDto!.count,
        );
        break;
      case 'All':
        const all = await getAll({
          filter: {
            dto: { searchText },
          },
        });
        const datas = all!.data!.searchAllQueryHandler!.listDto!.items![0];
        const campaginIds = datas!.fundRaisings;
        let campagins: any = [];
        if (campaginIds) {
          getCampaginPostFromPostServer({
            filter: { ids: campaginIds, pageSize, pageIndex: 0, dto: { status: PostStatus.Show } },
          })
            .unwrap()
            .then((res) => {
              campagins = res.getHomePageFundRaisingPosts.listDto?.items;
              dispatch(setValues({ searchTab: 'Fundraising', data: campagins }));
            });
        }
        const socialIds = datas!.posts;
        let socials: any = [];
        if (socialIds) {
          getSocialPostsFromPostServer({ filter: { ids: socialIds, pageIndex: 0, pageSize: pageSize } })
            .unwrap()
            .then((res) => {
              socials = res.getHomePageSocialPosts.listDto?.items;
              dispatch(setValues({ searchTab: 'Post', data: socials }));
            });
        }
        const allHashtags = datas!.hashtags as any;
        const allNgos = datas!.ngos as any;
        const allPeople = datas!.people as any;
        dispatch(setValues({ searchTab: 'Hashtags', data: allHashtags }));
        dispatch(setValues({ searchTab: 'People', data: allPeople }));
        dispatch(setValues({ searchTab: 'Ngo', data: allNgos }));
        break;
    }
  };

  const addToReduxValues = (type: searchTabs, data: any, count: number) => {
    if (needToReset.current) {
      dispatch(setValues({ searchTab: type, data }));
    } else {
      dispatch(updateValues({ data, searchTab: type }));
    }
    dispatch(setCount(count));
  };

  useEffect(() => {
    if (
      gettingPeopleLoading ||
      getCampaignPostsLoading ||
      gettingCampaginPostFromPostServerLoading ||
      gettingHashtagsLoading ||
      gettingNgoLoading ||
      gettingSocialPostsLoading ||
      getttingSocialPostsFromPostServerLoading ||
      gettingAllLoading
    ) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoading(false));
    }
  }, [
    gettingPeopleLoading,
    getCampaignPostsLoading,
    gettingCampaginPostFromPostServerLoading,
    gettingHashtagsLoading,
    gettingNgoLoading,
    gettingSocialPostsLoading,
    getttingSocialPostsFromPostServerLoading,
    gettingAllLoading,
  ]);
};

export default useSearch;
