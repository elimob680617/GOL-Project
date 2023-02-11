/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { BottomSheet } from 'react-spring-bottom-sheet';

import { Button, Divider, IconButton, Stack, Typography } from '@mui/material';

import Image from 'src/components/Image';
import { dispatch, useSelector } from 'src/store';
import {
  getActiveFilter,
  getConfirmSearch,
  getSearchedExpandedFilter,
  getSearchedValues,
  resetConfirmedSearch,
  setActiveFilter,
  setConfirmiedSearch,
  setSearchedExpandedFilter,
  valuingSearchValues,
} from 'src/store/slices/search';

import RenderFilter from './RenderFilter';
import SearchMessages from './Search.messages';

export type Expanded =
  | 'Location'
  | 'Skill'
  | 'Worked Company'
  | 'University'
  | 'College'
  | 'Sort'
  | 'Type'
  | 'Creation Date'
  | 'Category'
  | 'Location'
  | 'NGO'
  | 'Industry'
  | 'NGO Size'
  | 'Creation Time'
  | 'Posted by';

const SearchFilter: FC = () => {
  const activeFilter = useSelector(getActiveFilter);
  const activeSearched = useSelector(getSearchedValues);
  const confirmedSearch = useSelector(getConfirmSearch);
  const expandedFilter = useSelector(getSearchedExpandedFilter);

  const handleExpandedChange = (panel: Expanded | null) => {
    dispatch(setSearchedExpandedFilter(panel));
  };

  const handleConfirmSearch = () => {
    dispatch(setConfirmiedSearch(activeSearched));
    handleExpandedChange(null);
  };

  const handleResetSearch = () => {
    dispatch(resetConfirmedSearch());
  };

  useEffect(() => {
    handleExpandedChange(null);
  }, [activeFilter]);

  useEffect(() => {
    dispatch(valuingSearchValues(confirmedSearch));
  }, [expandedFilter]);

  return (
    <BottomSheet
      open={!!activeFilter && activeFilter !== 'All'}
      onDismiss={() => dispatch(setActiveFilter(null))}
      snapPoints={({ minHeight, maxHeight }) => [minHeight]}
    >
      <Stack p={3} spacing={3}>
        <Stack justifyContent="space-between" spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              {expandedFilter && (
                <IconButton onClick={() => handleExpandedChange(null)} sx={{ padding: 0 }}>
                  <Image src="/icons/arrow/left-arrow.svg" width={24} height={24} alt="header-left-arrow" />
                </IconButton>
              )}

              <Typography variant="subtitle1" color="text.primary">
                {expandedFilter ? expandedFilter : 'Filters'}
              </Typography>
            </Stack>
            {expandedFilter && confirmedSearch !== activeSearched && (
              <Button onClick={() => handleConfirmSearch()} variant="text" sx={{ color: 'primary.main' }}>
                <FormattedMessage {...SearchMessages.done} />
              </Button>
            )}
            {!expandedFilter && confirmedSearch !== activeSearched && (
              <Button onClick={() => handleResetSearch()} variant="text" sx={{ color: 'info.main' }}>
                <FormattedMessage {...SearchMessages.clearAll} />
              </Button>
            )}
          </Stack>

          <Divider />

          <RenderFilter activeFilter={activeFilter} />
        </Stack>
      </Stack>
    </BottomSheet>
  );
};

export default SearchFilter;
