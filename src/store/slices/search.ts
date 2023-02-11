import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IIndustry } from 'src/types/categories';
import { ICollege } from 'src/types/education';
import { IExperirnce } from 'src/types/experience';
import { IPlace } from 'src/types/location';
import { IRecentlySearch } from 'src/types/search';
import { ISkil } from 'src/types/skill';
import { ISearchedUser, ISearchNgoReponse, ISearchUserResponse } from 'src/types/user';
import { Expanded } from 'src/pwa-sections/search/SearchFilter';

// types
import { searchTabs } from 'src/sections/search/SearchMain';
import { ConnectionStatusType, SearchCategoryEnumType } from 'src/types/serverTypes';
import { RootState } from '..';

// ----------------------------------------------------------------------

export interface ISearchedKeyWord {
  id?: any | null;
  keyword?: string | null;
}
export interface IFilters {
  searchedText: string;
  locations: IPlace[];
  skills: ISkil[];
  companyWorkeds: IExperirnce[];
  universities: ICollege[];
  colleges: ICollege[];
  peoples: ISearchedUser[];
  sortBy: string;
  companySize: string;
  postType: string;
  fundraisingType: string;
  fundraisingCategory: SearchCategoryEnumType[];
  industries: IIndustry[];
  mediaCreationTime: string;
  ngoSize: string[];
  ngos: ISearchNgoReponse[];
}

export interface ISearch {
  filters: IFilters;
  confirimedSearched: IFilters;
  searchedPeople: ISearchUserResponse[];
  searchedNgo: ISearchNgoReponse[];
  lastKeyWords: ISearchedKeyWord[];
  Post: any[];
  Fundraising: any[];
  People: any[];
  Ngo: any[];
  loading: boolean;
  count: number;
  Hashtags: any[];
  expandedFilter: Expanded | null;
  recently: IRecentlySearch | null;
  activeFilter: searchTabs | null;

}

export const filterInitialState: IFilters = {
  searchedText: '',
  colleges: [],
  companyWorkeds: [],
  locations: [],
  skills: [],
  sortBy: '',
  universities: [],
  peoples: [],
  postType: '',
  fundraisingType: '',
  fundraisingCategory: [],
  industries: [],
  companySize: '',
  mediaCreationTime: '',
  ngoSize: [],
  ngos: [],
};

const initialState: ISearch = {
  filters: filterInitialState,
  confirimedSearched: filterInitialState,
  searchedPeople: [],
  searchedNgo: [],
  lastKeyWords: [],
  Post: [],
  Fundraising: [],
  People: [],
  Ngo: [],
  loading: false,
  count: 0,
  Hashtags: [],
  expandedFilter: null,
  recently: null,
  activeFilter: null,
};

const slice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    valuingSearchValues(state, action: PayloadAction<IFilters>) {
      state.filters.colleges = action.payload.colleges;
      state.filters.companyWorkeds = action.payload.companyWorkeds;
      state.filters.locations = action.payload.locations;
      state.filters.searchedText = action.payload.searchedText;
      state.filters.skills = action.payload.skills;
      state.filters.sortBy = action.payload.sortBy;
      state.filters.universities = action.payload.universities;
      state.filters.peoples = action.payload.peoples;
      state.filters.postType = action.payload.postType;
      state.filters.fundraisingType = action.payload.fundraisingType;
      state.filters.fundraisingCategory = action.payload.fundraisingCategory;
      state.filters.industries = action.payload.industries;
      state.filters.companySize = action.payload.companySize;
      state.filters.mediaCreationTime = action.payload.mediaCreationTime;
      state.filters.ngoSize = action.payload.ngoSize;
      state.filters.ngos = action.payload.ngos;
    },
    setConfirmiedSearch(state, action: PayloadAction<IFilters>) {
      Object.assign(state.confirimedSearched,action.payload)
    },
    setSearchLocation(state, action: PayloadAction<IPlace[]>) {
      state.filters.locations = action.payload;
    },
    setSearchNgoFilter(state, action: PayloadAction<ISearchNgoReponse[]>) {
      state.filters.ngos = action.payload;
    },
    setSearchSkill(state, action: PayloadAction<ISkil[]>) {
      state.filters.skills = action.payload;
    },
    addSearchCollege(state, action: PayloadAction<ICollege>) {
      state.filters.colleges = [...state.filters.colleges, action.payload];
    },
    removeSearchCollege(state, action: PayloadAction<ICollege>) {
      state.filters.colleges = [...state.filters.colleges.filter((i) => i.id !== action.payload.id)];
    },
    addSearchUniversity(state, action: PayloadAction<ICollege>) {
      state.filters.universities = [...state.filters.universities, action.payload];
    },
    removeSearchUniversity(state, action: PayloadAction<ICollege>) {
      state.filters.universities = [...state.filters.universities.filter((i) => i.id !== action.payload.id)];
    },
    addSearchCompany(state, action: PayloadAction<IExperirnce>) {
      state.filters.companyWorkeds = [...state.filters.companyWorkeds, action.payload];
    },
    removeSearchCompany(state, action: PayloadAction<IExperirnce>) {
      state.filters.companyWorkeds = [...state.filters.companyWorkeds.filter((i) => i.id !== action.payload.id)];
    },
    addSearchPeople(state, action: PayloadAction<ISearchedUser>) {
      state.filters.peoples = [...state.filters.peoples, action.payload];
    },
    removeSearchPeople(state, action: PayloadAction<ISearchedUser>) {
      state.filters.peoples = [...state.filters.peoples.filter((i) => i.id !== action.payload.id)];
    },
    setSearchSor(state, action: PayloadAction<string>) {
      state.filters.sortBy = action.payload;
    },
    setSearchPostType(state, action: PayloadAction<string>) {
      state.filters.postType = action.payload;
    },
    setSearchFundraisingType(state, action: PayloadAction<string>) {
      state.filters.fundraisingType = action.payload;
    },
    addFundraisingCategory(state, action: PayloadAction<SearchCategoryEnumType>) {
      state.filters.fundraisingCategory = [...state.filters.fundraisingCategory, action.payload];
    },
    removeFundraisingCategory(state, action: PayloadAction<SearchCategoryEnumType>) {
      state.filters.fundraisingCategory = [...state.filters.fundraisingCategory.filter((i) => i !== action.payload)];
    },
    addIndustry(state, action: PayloadAction<IIndustry>) {
      state.filters.industries = [...state.filters.industries, action.payload];
    },
    removeIndustry(state, action: PayloadAction<IIndustry>) {
      state.filters.industries = [...state.filters.industries.filter((i) => i.id !== action.payload.id)];
    },
    setSearchCompanySize(state, action: PayloadAction<string>) {
      state.filters.companySize = action.payload;
    },
    setMediaCreationTime(state, action: PayloadAction<string>) {
      state.filters.mediaCreationTime = action.payload;
    },
    setNgoSize(state, action: PayloadAction<string[]>) {
      state.filters.ngoSize = action.payload;
    },
    resetSearch(state) {
      Object.assign(state.filters,initialState.filters)
    },
    resetConfirmedSearch(state){
      Object.assign(state.confirimedSearched,initialState.filters)
    },
    setSearchedText(state, action: PayloadAction<string>) {
      state.filters.searchedText = action.payload;
      state.confirimedSearched.searchedText = action.payload;
    },
    setSearchedPeoples(state, action: PayloadAction<ISearchUserResponse[]>) {
      state.searchedPeople = action.payload;
    },
    changeSearchedUserStatus(
      state,
      action: PayloadAction<{
        index: number;
        otherToMe: ConnectionStatusType;
        meToOther: ConnectionStatusType;
      }>
    ) {
      const temp = state.searchedPeople[action.payload.index];

      state.searchedPeople.splice(action.payload.index, 1, {
        ...temp,
        otherToMeStatus: action.payload.otherToMe,
        meToOtherStatus: action.payload.meToOther,
      });
    },
    setSearchedNgos(state, action: PayloadAction<ISearchUserResponse[]>) {
      state.searchedNgo = action.payload;
    },
    changeSearchedNgoStatus(
      state,
      action: PayloadAction<{
        index: number;
        otherToMe: ConnectionStatusType;
        meToOther: ConnectionStatusType;
      }>
    ) {
      const temp = state.searchedNgo[action.payload.index];

      state.searchedNgo.splice(action.payload.index, 1, {
        ...temp,
        otherToMeStatus: action.payload.otherToMe,
        meToOtherStatus: action.payload.meToOther,
      });
    },
    valuingAllSearchedKeyWord(state, action: PayloadAction<ISearchedKeyWord[]>) {
      state.lastKeyWords = action.payload;
    },
    addKeyWord(state, action: PayloadAction<ISearchedKeyWord>) {
      state.lastKeyWords = [action.payload, ...state.lastKeyWords];
    },
    removeKeyWord(state, action: PayloadAction<string>) {
      state.lastKeyWords = [...state.lastKeyWords.filter((i) => i.id !== action.payload)];
    },
    setValues(state, action: PayloadAction<{ searchTab: searchTabs; data: any[] }>) {
      const key = action.payload.searchTab as keyof ISearch ;
      (state[key] as any[])  = action.payload.data;
    },
    updateValues(state, action: PayloadAction<{ searchTab: searchTabs; data: any[] }>) {
      const key = action.payload.searchTab as keyof ISearch ;
      (state[key] as any[]) = [...(state[key] as any[]), ...action.payload.data];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
    resetAllSearched(state) {
      state.count = 0;
      state.loading = false;
      state.Fundraising = [];
      state.Hashtags = [];
      state.Ngo = [];
      state.People = [];
      state.Post = [];
    },
    setSearchedExpandedFilter(state, action: PayloadAction<Expanded | null>) {
      state.expandedFilter = action.payload;
    },
    setRecently(state, action: PayloadAction<IRecentlySearch>) {
      state.recently = action.payload;
    },
    setActiveFilter(state, action: PayloadAction<searchTabs|null>) {
      state.activeFilter = action.payload;
    },
  },
});

export const getSearchedValues = (state: RootState) => state.searchSlice.filters as IFilters;
export const getSearchedPeoples = (state: RootState) => state.searchSlice.searchedPeople as ISearchUserResponse[];
export const getSearchedNgos = (state: RootState) => state.searchSlice.searchedNgo as ISearchNgoReponse[];
export const getSearchedLastKeyWords = (state: RootState) => state.searchSlice.lastKeyWords as ISearchedKeyWord[];
export const getSearchedSocialPosts = (state: RootState) => state.searchSlice.Post as any[];
export const getSearchLoading = (state: RootState) => state.searchSlice.loading as boolean;
export const getSearchCount = (state: RootState) => state.searchSlice.count as number;
export const getSearchedHashtags = (state: RootState) => state.searchSlice.Hashtags as any[];
export const getSearchedNgo = (state: RootState) => state.searchSlice.Ngo as any[];
export const getSearchedPeople = (state: RootState) => state.searchSlice.People as any[];
export const getSearchedCampaginPost = (state: RootState) => state.searchSlice.Fundraising as any[];
export const getSearchedExpandedFilter = (state: RootState) => state.searchSlice.expandedFilter as Expanded;
export const getConfirmSearch = (state: RootState) => state.searchSlice.confirimedSearched as IFilters;
export const getRecently = (state: RootState) => state.searchSlice.recently as IRecentlySearch|null;
export const getActiveFilter = (state: RootState) => state.searchSlice.activeFilter as searchTabs;

// Reducer
export default slice.reducer;

// Actions
export const {
  resetSearch,
  valuingSearchValues,
  setSearchLocation,
  setSearchSkill,
  addSearchCollege,
  removeSearchCollege,
  addSearchUniversity,
  removeSearchUniversity,
  addSearchCompany,
  removeSearchCompany,
  setSearchSor,
  addSearchPeople,
  removeSearchPeople,
  setSearchPostType,
  setSearchFundraisingType,
  addFundraisingCategory,
  removeFundraisingCategory,
  addIndustry,
  removeIndustry,
  setSearchCompanySize,
  setMediaCreationTime,
  setSearchedText,
  setSearchedPeoples,
  changeSearchedUserStatus,
  changeSearchedNgoStatus,
  setSearchedNgos,
  setNgoSize,
  setSearchNgoFilter,
  addKeyWord,
  removeKeyWord,
  valuingAllSearchedKeyWord,
  setValues,
  updateValues,
  setLoading,
  setCount,
  resetAllSearched,
  setSearchedExpandedFilter,
  resetConfirmedSearch,
  setConfirmiedSearch,
  setRecently,
  setActiveFilter,

} = slice.actions;
