/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { Button, IconButton, InputAdornment, Stack, TextField } from '@mui/material';

import { useAddKeyWordMutation } from 'src/_graphql/search/mutations/addKeyWord.generated';
import { useRemoveKeyWordMutation } from 'src/_graphql/search/mutations/removeKeyWord.generated';
import { useLazyGetLastKeyWordQuery } from 'src/_graphql/search/queries/getLastKeyword.generated';
import { useLazyGetRecentlyQuery } from 'src/_graphql/search/queries/getRecently.generated';
import { Icon } from 'src/components/Icon';
import { localStorageKeys } from 'src/config';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import {
  IFilters,
  ISearchedKeyWord,
  addKeyWord,
  filterInitialState,
  getConfirmSearch,
  getRecently,
  getSearchedLastKeyWords,
  removeKeyWord,
  resetAllSearched,
  resetSearch,
  setConfirmiedSearch,
  setRecently,
  setSearchedText,
  valuingAllSearchedKeyWord,
} from 'src/store/slices/search';
import { IIndustry } from 'src/types/categories';
import { ICollege } from 'src/types/education';
import { IExperirnce } from 'src/types/experience';
import { IPlace } from 'src/types/location';
import { IRecentlySearch } from 'src/types/search';
import { SearchCategoryEnumType } from 'src/types/serverTypes';
import { ISkil } from 'src/types/skill';
import { ISearchNgoReponse, ISearchedUser } from 'src/types/user';

import { PwaSearchSubjectsFuncs } from './PwaSearchSubjects';
import SearchMessages from './Search.messages';
import SearchBody from './SearchBody';
import SearchFilter from './SearchFilter';
import History from './history/History';
import useSearch from './useSearch';

export type searchTabs = 'All' | 'People' | 'Ngo' | 'Post' | 'Fundraising' | 'Hashtags' | '';

type Params = {
  searchTab: searchTabs;
};

function SearchMain() {
  const navigate = useNavigate();
  const { searchTab } = useParams<Params>();
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const [firstTime, setFirstTime] = useState<boolean>(true);
  const confirmedSearch = useSelector(getConfirmSearch);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [canSendRequest, setCanSendRequest] = useState<boolean>(false);
  const [searchedValueText, setSearchedValueText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<searchTabs | null>(null);
  const [getLastKeyWordQuery] = useLazyGetLastKeyWordQuery();
  const [getRecentlyRequest] = useLazyGetRecentlyQuery();
  const [removeKeyWordMutation] = useRemoveKeyWordMutation();
  const [addKeyWordMutation] = useAddKeyWordMutation();
  const keyWords = useSelector(getSearchedLastKeyWords);
  const recentlies = useSelector(getRecently);

  useSearch(searchTab ? searchTab : null, pageIndex, canSendRequest);

  const nextPage = () => {
    setPageIndex(pageIndex + 1);
  };

  useEffect(() => {
    if (searchTab) {
      setPageIndex(1);
    }
  }, [searchTab]);

  useEffect(() => {
    if (confirmedSearch.searchedText) {
      setSearchedValueText(confirmedSearch.searchedText);
    }
  }, [confirmedSearch.searchedText]);

  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
      return;
    }
    dispatch(resetSearch());
  }, [searchTab]);

  useEffect(() => {
    if (!firstTime) {
      PwaSearchSubjectsFuncs.filterChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmedSearch.searchedText]);

  useEffect(() => {
    const getFilterChangedSubscriber = PwaSearchSubjectsFuncs.getFilterChanged().subscribe((res) => {
      if (!firstTime) {
        setPageIndex(1);
        dispatch(resetAllSearched());
        localStorage.setItem(localStorageKeys.search, JSON.stringify(confirmedSearch));
        let searchQuery = '';
        if (searchTab) {
          searchQuery = searchTab;
        }
        navigate(
          {
            pathname: `/${PATH_APP.search.root}/${searchQuery}`,
            search: JSON.stringify({ search: JSON.stringify(valuingQuery()) }),
          },
          { replace: true },
        );
      }
    });

    if (searchParams) {
      const searchObject = { ...filterInitialState };
      const search = JSON.parse(searchParams.get('search') ?? '');
      if (!localStorage.getItem(localStorageKeys.search)) return;
      const searchLocalStageValue = JSON.parse(localStorage.getItem(localStorageKeys.search)!) as IFilters;
      if (search.colleges) {
        const colleges = searchLocalStageValue.colleges.filter((college) =>
          search.colleges.some((i: string) => i === college.id),
        );
        searchObject.colleges = colleges as ICollege[];
      }
      if (search.peoples) {
        const peoples = searchLocalStageValue.peoples.filter((people) =>
          search.peoples.some((i: string) => i === people.id),
        );
        searchObject.peoples = peoples as ISearchedUser[];
      }
      if (search.companyWorkeds) {
        const companies = searchLocalStageValue.companyWorkeds.filter((company) =>
          search.companyWorkeds.some((i: string) => i === company.id),
        );
        searchObject.companyWorkeds = companies as IExperirnce[];
      }
      if (search.industries) {
        const industries = searchLocalStageValue.industries.filter((industry) =>
          search.industries.some((i: string) => i === industry.id),
        );
        searchObject.industries = industries as IIndustry[];
      }
      if (search.fundraisingCategory) {
        const fundraisingCategory = searchLocalStageValue.fundraisingCategory.filter((category) =>
          search.fundraisingCategory.some((i: string) => i === category),
        );
        searchObject.fundraisingCategory = fundraisingCategory as SearchCategoryEnumType[];
      }
      if (search.companySize) {
        searchObject.companySize = search.companySize;
      }
      if (search.ngoSize) {
        searchObject.ngoSize = search.ngoSize;
      }
      if (search.ngos) {
        const ngos = searchLocalStageValue.ngos.filter((ngo) => search.ngos.some((i: string) => i === ngo.id!));
        searchObject.ngos = ngos as ISearchNgoReponse[];
      }
      if (search.mediaCreationTime) {
        searchObject.mediaCreationTime = search.mediaCreationTime;
      }
      if (search.locations) {
        const locations = searchLocalStageValue.locations.filter((location) =>
          search.locations.some((i: string) => i === location.id),
        );
        searchObject.locations = locations as IPlace[];
      }
      if (search.postType) {
        searchObject.postType = search.postType;
      }
      if (search.skills) {
        const skills = searchLocalStageValue.skills.filter((skill) =>
          search.skills.some((i: string) => i === skill.id),
        );
        searchObject.skills = skills as ISkil[];
      }
      if (search.universities) {
        const universities = searchLocalStageValue.universities.filter((university) =>
          search.universities.some((i: string) => i === university.id),
        );
        searchObject.universities = universities as ICollege[];
      }
      if (search.fundraisingType) {
        searchObject.fundraisingType = search.fundraisingType;
      }
      if (search.sortBy) {
        searchObject.sortBy = search.sortBy;
      }

      if (search.searchedText) {
        searchObject.searchedText = search.searchedText;
      }
      dispatch(setConfirmiedSearch(searchObject));
      setTimeout(() => {
        setCanSendRequest(true);
      }, 10);
    } else {
      setCanSendRequest(true);
    }

    return () => {
      getFilterChangedSubscriber.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (keyWords.length === 0) {
      getLastKeyWordQuery({ filter: { pageIndex: 0, pageSize: 5 } })
        .unwrap()
        .then((res) => {
          if (res?.lastKeywordQueryHandler?.listDto?.items) {
            dispatch(valuingAllSearchedKeyWord(res!.lastKeywordQueryHandler!.listDto!.items as ISearchedKeyWord[]));
          }
        });
    }
    if (!recentlies) {
      getRecentlyRequest({ filter: { pageIndex: 0, pageSize: 5 } })
        .unwrap()
        .then((res) => {
          if (res?.lastSeenQueryHandler?.listDto?.items?.[0]) {
            const recentlySearchRes: IRecentlySearch = {
              fundRaisingPosts: res?.lastSeenQueryHandler?.listDto?.items[0]?.fundRaisingPosts as any[],
              hashtags: res?.lastSeenQueryHandler?.listDto?.items?.[0].hashtags as any[],
              ngos: res.lastSeenQueryHandler.listDto.items[0].ngos as any[],
              people: res.lastSeenQueryHandler.listDto.items[0].people as any[],
              posts: res.lastSeenQueryHandler.listDto.items[0].posts as any[],
            };

            dispatch(setRecently(recentlySearchRes));
          }
        });
    }
  }, []);

  const checkList = (list: any[]) => (list.length > 0 ? true : false);

  const valuingQuery = () => {
    const retuerned: any = {};
    if (checkList(confirmedSearch.universities)) {
      retuerned.universities = confirmedSearch.universities.map((i) => i.id);
    }
    if (checkList(confirmedSearch.skills)) {
      retuerned.skills = confirmedSearch.skills.map((i) => i.id);
    }
    if (checkList(confirmedSearch.peoples)) {
      retuerned.peoples = confirmedSearch.peoples.map((i) => i.id);
    }
    if (checkList(confirmedSearch.ngoSize)) {
      retuerned.ngoSize = confirmedSearch.ngoSize;
    }
    if (checkList(confirmedSearch.ngos)) {
      retuerned.ngos = confirmedSearch.ngos.map((i) => i.id);
    }
    if (checkList(confirmedSearch.colleges)) {
      retuerned.colleges = confirmedSearch.colleges.map((i) => i.id);
    }
    if (checkList(confirmedSearch.industries)) {
      retuerned.industries = confirmedSearch.industries.map((i) => i.id);
    }
    if (confirmedSearch.mediaCreationTime) {
      retuerned.mediaCreationTime = confirmedSearch.mediaCreationTime;
    }
    if (confirmedSearch.companySize) {
      retuerned.companySize = confirmedSearch.companySize;
    }
    if (checkList(confirmedSearch.companyWorkeds)) {
      retuerned.companyWorkeds = confirmedSearch.companyWorkeds.map((i) => i.id);
    }
    if (checkList(confirmedSearch.locations)) {
      retuerned.locations = confirmedSearch.locations.map((i) => i.id);
    }
    if (checkList(confirmedSearch.fundraisingCategory)) {
      retuerned.fundraisingCategory = confirmedSearch.fundraisingCategory;
    }
    if (checkList(confirmedSearch.ngos)) {
      retuerned.ngos = confirmedSearch.ngos;
    }
    if (confirmedSearch.fundraisingType) {
      retuerned.fundraisingType = confirmedSearch.fundraisingType;
    }
    if (confirmedSearch.postType) {
      retuerned.postType = confirmedSearch.postType;
    }
    if (confirmedSearch.sortBy) {
      retuerned.sortBy = confirmedSearch.sortBy;
    }
    if (confirmedSearch.searchedText) {
      retuerned.searchedText = confirmedSearch.searchedText;
    }
    return retuerned;
  };

  const handleSearchedText = (keyword?: string) => {
    const value = keyword || searchedValueText;
    if (searchTab) {
      navigate(PATH_APP.search.all);
    }
    dispatch(setSearchedText(value));
    if (searchedValueText)
      addKeyWordMutation({ keyWord: { dto: { keyword: value } } })
        .unwrap()
        .then((res) => {
          if (res?.keywordCommandHandler?.listDto?.items) {
            if (keyWords.find((i) => i!.keyword!.trim() === value.trim())) {
              return;
            }
            dispatch(addKeyWord(res!.keywordCommandHandler!.listDto!.items[0]!));
          }
        });
  };

  useEffect(() => {
    if (searchTab) {
      setActiveTab(searchTab);
    }
  }, [searchTab]);

  const tabChanged = (tabname: searchTabs) => {
    setCanSendRequest(false);
    setTimeout(() => {
      setCanSendRequest(true);
    }, 50);
    dispatch(resetSearch());
    dispatch(resetAllSearched());

    navigate(
      {
        pathname: `/${PATH_APP.search.root}/${searchTab}`,
        search: JSON.stringify({ search: JSON.stringify(valuingQuery()) }),
      },
      { replace: true },
    );
  };

  useEffect(() => {
    if (activeTab) tabChanged(activeTab);
  }, [activeTab]);

  const removeKeyWordHandler = (keyWord: ISearchedKeyWord) => {
    dispatch(removeKeyWord(keyWord!.id!));
    removeKeyWordMutation({ filter: { dto: { id: keyWord.id } } })
      .unwrap()
      .catch((err) => {
        dispatch(addKeyWord(keyWord));
      });
  };

  return (
    <Stack spacing={0.5} sx={{ height: '100%', overflow: 'hidden', bgcolor: 'common.white' }}>
      <Stack
        spacing={2}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 2, py: 1, bgcolor: 'common.white' }}
      >
        <TextField
          size="small"
          sx={{ flex: 1 }}
          value={searchedValueText}
          onChange={(e) => setSearchedValueText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearchedText();
            }
          }}
          id="text-search"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => handleSearchedText()}>
                  <Icon name="Research" type="solid" size={24} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        {!!searchTab && (
          <Button onClick={() => navigate(PATH_APP.home.index)} variant="text" sx={{ color: 'grey.900' }}>
            <FormattedMessage {...SearchMessages.cancel} />
          </Button>
        )}
      </Stack>
      <>
        {!!searchTab && <SearchBody nextPage={nextPage} searchType={searchTab} />}
        {!searchTab && (
          <History
            keyWordRemoved={removeKeyWordHandler}
            keyWordChoosed={(keyWord) => handleSearchedText(keyWord.keyword ?? '')}
          />
        )}
      </>
      <SearchFilter />
    </Stack>
  );
}

export default SearchMain;
