import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

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
} from '@mui/material';

import { useLazySearchPlacesQuery } from 'src/_graphql/locality/queries/searchPlaces.generated';
import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';
import SelectLocationRow from 'src/components/location/LocationSelect';
import NotFound from 'src/components/notFound/NotFound';
import useDebounce from 'src/hooks/useDebounce';
import { dispatch, useSelector } from 'src/store';
import { basicCreateSocialPostSelector, setLocation } from 'src/store/slices/post/createSocialPost';

import SocialPostMessages from '../socialPost.message';
import SocialPostAddLocationHeader from './SocialPostAddLocationHeader';

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

const SocialPostAddLocationDialog: FC = () => {
  const [getPlacesQuery, { data: places, isFetching: fetchingPlaceLoading }] = useLazySearchPlacesQuery();

  const [searchedText, setSearchedText] = useState<string>('');

  const [createPlaceLoading, setCreatePlaceLoading] = useState<boolean>(false);

  const post = useSelector(basicCreateSocialPostSelector);

  const debouncedValue = useDebounce<string>(searchedText, 500);

  useEffect(() => {
    if (debouncedValue)
      getPlacesQuery({
        filter: { dto: { searchText: debouncedValue } },
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const getCreatePlaceLoading = (loading: boolean) => {
    setCreatePlaceLoading(loading);
  };

  return (
    <Dialog maxWidth="sm" fullWidth open={true} aria-labelledby="responsive-dialog-title">
      <DialogTitle sx={{ padding: 0 }} id="responsive-dialog-title">
        <SocialPostAddLocationHeader />
      </DialogTitle>

      {!createPlaceLoading && (
        <DialogContent sx={{ height: 600, marginTop: 2, paddingRight: 0, paddingLeft: 0 }}>
          <Stack spacing={3}>
            <Box sx={{ width: '100%', paddingRight: 3, paddingLeft: 3 }}>
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
                        <Icon size={24} name="Close" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {post.location && post.location.id && !debouncedValue && (
              <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                <Typography
                  sx={[
                    (theme) => ({
                      color: theme.palette.text.primary,

                      fontSize: '20px',

                      lineHeight: '25px',

                      fontWeight: 700,
                    }),
                  ]}
                  variant="h5"
                >
                  <FormattedMessage {...SocialPostMessages.currentlySelected} />
                </Typography>

                <Stack
                  sx={{ marginTop: 3, height: 24, marginBottom: 3 }}
                  direction="row"
                  justifyContent="space-between"
                >
                  <OneLineTextStyle variant="subtitle1">{post.location.address}</OneLineTextStyle>

                  <IconButton onClick={() => dispatch(setLocation(null))} sx={{ padding: '1px' }}>
                    <img src="/icons/Close/24/Outline.svg" width={24} height={24} alt="remove currently icon" />
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
                  places?.searchPlaces.listDto?.items[0]?.predictions?.map((place, index) => {
                    if (index === 0) {
                      return (
                        <Box sx={{ paddingRight: 3, paddingLeft: 3 }}>
                          <SelectLocationRow
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
                      img={!debouncedValue ? '/images/location/location.svg' : undefined}
                      text={!debouncedValue ? 'Search here to find your location' : 'Sorry! No results found'}
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
          <Image src="/images/location/location.svg" alt="image" />

          <Typography
            variant="body1"
            sx={{ fontWeight: '300', fontSize: '16px', lineHeight: '20px', color: 'text.primary' }}
          >
            <FormattedMessage {...SocialPostMessages.pleaseWait} />
          </Typography>
        </Stack>
      )}
    </Dialog>
  );
};

export default SocialPostAddLocationDialog;
