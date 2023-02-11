import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import { useLazySearchPlacesQuery } from 'src/_graphql/locality/queries/searchPlaces.generated';
import location from 'src/assets/icons/location/24/Outline.svg';
//icon
import { Icon } from 'src/components/Icon';
import SelectLocationRow from 'src/components/location/LocationSelect';
import NotFound from 'src/components/notFound/NotFound';
import useDebounce from 'src/hooks/useDebounce';
import { dispatch, useSelector } from 'src/store';
import { basicSharePostSelector, setSharedPostLocation } from 'src/store/slices/post/sharePost';

import SharePostMessages from './SharePost.messages';

const HeaderWrapperStyle = styled(Stack)(({ theme }) => ({
  // height: 56,
  padding: theme.spacing(2, 1.5, 2, 2),
  boxShadow: '0px 0px 1px rgba(40, 41, 61, 0.04), 0px 2px 4px rgba(96, 97, 112, 0.16)',
}));
const OneLineTextStyle = styled(Typography)(({ theme }) => ({
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 1,
  WebkitBoxOrient: 'vertical',
  color: theme.palette.text.primary,
  fontWeight: 500,
  lineHeight: '23px',
  fontSize: '16px',
}));

const SharePostAddLocationDialog = () => {
  const back = useNavigate();
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [getPlacesQuery, { data: places, isFetching: fetchingPlaceLoading }] = useLazySearchPlacesQuery();
  const [searchedText, setSearchedText] = useState<string>('');
  const [createPlaceLoading, setCreatePlaceLoading] = useState<boolean>(false);
  const post = useSelector(basicSharePostSelector);
  const debouncedValue = useDebounce<string>(searchedText, 500);

  useEffect(() => {
    if (debouncedValue)
      getPlacesQuery({
        filter: { dto: { searchText: debouncedValue } },
      });
  }, [debouncedValue, getPlacesQuery]);

  const getCreatePlaceLoading = (loading: boolean) => {
    setCreatePlaceLoading(loading);
  };

  return (
    <>
      <Dialog maxWidth="sm" fullWidth open={true} aria-labelledby="responsive-dialog-title">
        <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
          <HeaderWrapperStyle spacing={2} direction="row" alignItems="center">
            <IconButton onClick={() => back(-1)} sx={{ padding: 0 }}>
              <Icon name="left-arrow-1" color="grey.500" type="linear" />
            </IconButton>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.primary}
              sx={{
                color: 'grey.900',
                fontWeight: 500,
              }}
            >
              <FormattedMessage {...SharePostMessages.searchLocation} />
            </Typography>
          </HeaderWrapperStyle>
        </DialogTitle>

        {!createPlaceLoading && (
          <DialogContent sx={{ height: 600, marginTop: 2, paddingRight: 0, paddingLeft: 0 }}>
            <Stack spacing={3}>
              <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                <TextField
                  value={searchedText}
                  onChange={(e) => setSearchedText(e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="Where are you?"
                  InputProps={{
                    endAdornment: searchedText && (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setSearchedText('')}>
                          <Icon name="Close" color="grey.500" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              {post.location && post.location.id && !debouncedValue && (
                <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                  <Typography
                    // sx={[
                    //   (theme) => ({
                    //     color: theme.palette.text.primary,
                    //     fontSize: '20px',
                    //     lineHeight: '25px',
                    //     fontWeight: 700,
                    //   }),
                    // ]}
                    variant="h5"
                  >
                    <FormattedMessage {...SharePostMessages.currentlySelected} />
                  </Typography>
                  <Stack
                    sx={{ marginTop: 3, height: 24, marginBottom: 3 }}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <OneLineTextStyle variant="subtitle1">{post.location.address}</OneLineTextStyle>

                    <IconButton onClick={() => dispatch(setSharedPostLocation(null))} sx={{ padding: '1px' }}>
                      <Icon name="Close" color="grey.500" type="linear" />
                    </IconButton>
                  </Stack>
                </Box>
              )}

              {!fetchingPlaceLoading && (
                <Stack spacing={2}>
                  {debouncedValue &&
                  places &&
                  places.searchPlaces &&
                  places.searchPlaces.listDto &&
                  places.searchPlaces.listDto.items &&
                  places.searchPlaces.listDto.items[0]?.predictions &&
                  places.searchPlaces.listDto.items[0]?.predictions?.length > 0 ? (
                    places?.searchPlaces.listDto?.items[0]?.predictions?.map((place: any, index: any) => {
                      if (index === 0) {
                        return (
                          <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                            <SelectLocationRow
                              // postId={post.id}
                              locationType="share"
                              id={place?.placeId as string}
                              address={place?.description as string}
                              name={place?.structuredFormatting?.mainText as string}
                              secondaryText={place?.structuredFormatting?.secondaryText as string}
                              variant="home"
                              createPostLoadingChange={getCreatePlaceLoading}
                            />
                          </Box>
                        );
                      } else {
                        return (
                          <Stack spacing={2}>
                            <Divider />
                            <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                              <SelectLocationRow
                                //  postId={post.id}
                                locationType="share"
                                id={place?.placeId as string}
                                address={place?.description as string}
                                name={place?.structuredFormatting?.mainText as string}
                                secondaryText={place?.structuredFormatting?.secondaryText as string}
                                variant="home"
                                createPostLoadingChange={getCreatePlaceLoading}
                              />
                            </Box>
                          </Stack>
                        );
                      }
                    })
                  ) : (
                    <Box sx={{ marginTop: 8 }}>
                      <NotFound
                        img={!debouncedValue ? location : undefined}
                        text={
                          !debouncedValue
                            ? formatMessage(SharePostMessages.findUrLocation)
                            : formatMessage(SharePostMessages.noResults)
                        }
                      />
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
            {fetchingPlaceLoading && debouncedValue && (
              <Stack sx={{ marginTop: 4 }} alignItems="center">
                <CircularProgress />
              </Stack>
            )}
          </DialogContent>
        )}
        {createPlaceLoading && (
          <Stack
            spacing={3}
            sx={{ height: 600, marginTop: 2, paddingRight: 0, paddingLeft: 0 }}
            alignItems="center"
            justifyContent="center"
          >
            <img src={location} alt="location" loading="lazy" />
            <Typography
              variant="body1"
              sx={{ fontWeight: '300', fontSize: '16px', lineHeight: '20px', color: 'text.primary' }}
            >
              <FormattedMessage {...SharePostMessages.pleaseWait} />
            </Typography>
          </Stack>
        )}
      </Dialog>
    </>
  );
};

export default SharePostAddLocationDialog;
