import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';

import { useLazyGeocodeQuery } from 'src/_graphql/locality/queries/geocode.generated';
import { useLazySearchPlacesQuery } from 'src/_graphql/locality/queries/searchPlaces.generated';
import { Icon } from 'src/components/Icon';
import Loading from 'src/components/Loading';
import { useDispatch } from 'src/store';
import { ngoPlaceUpdated } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { RestrictionTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

export default function LocationNameDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [searching, setSearching] = useState<boolean>();
  const [getGeocode, { data: location }] = useLazyGeocodeQuery();
  const [searchPlaces, { data, isFetching }] = useLazySearchPlacesQuery();

  const handleInputChange = (val: string) => {
    if (val.length > 1) {
      setSearching(true);
      debounceFn(() =>
        searchPlaces({
          filter: {
            dto: {
              searchText: val,
              restrictionType: RestrictionTypeEnum.None,
            },
          },
        }),
      );
    }
  };
  const handleChange = (value: any & { inputValue?: string }) => {
    if (!!value?.placeId)
      getGeocode({
        filter: {
          dto: {
            placeId: value?.placeId,
          },
        },
      });
    dispatch(
      ngoPlaceUpdated({
        placeId: value.placeId,
        description: value.description,
        mainText: value.structuredFormatting?.mainText,
        lat: location?.geocode?.listDto?.items?.[0]?.lat,
        lng: location?.geocode?.listDto?.items?.[0]?.lng,
        isChange: true,
      }),
    );
    navigate(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ py: 3, minHeight: 320, minWidth: 600 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.searchLocationTitle} />
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack spacing={2} px={2}>
          <TextField
            size="small"
            onChange={(e) => {
              handleInputChange((e.target as HTMLInputElement).value);
            }}
            variant="outlined"
            placeholder={formatMessage(NgoPublicDetailsMessages.searchPlaceholder)}
          />
        </Stack>
        {!searching && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              <FormattedMessage {...NgoPublicDetailsMessages.startFindLocationMessage} />
            </Typography>
          </Box>
        )}

        <Box>
          {isFetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 6 }}>
              <Loading />
            </Box>
          ) : (
            <>
              {data?.searchPlaces?.listDto?.items?.[0]?.predictions?.map((place) => (
                <>
                  <Stack key={place?.placeId} direction="row" spacing={2} p={2} sx={{ cursor: 'default' }}>
                    <Box borderRadius={50} width={48} height={48} bgcolor="background.neutral">
                      {/* <img  width={24} height={24} alt="" style={{ marginRight: 8 }} /> */}
                    </Box>
                    <Stack spacing={0.5} onClick={() => handleChange(place)}>
                      <Typography variant="subtitle1" color="text.primary" sx={{ cursor: 'pointer' }}>
                        {place?.structuredFormatting?.mainText}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ cursor: 'pointer' }}>
                        {place?.description}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Divider />
                </>
              ))}
            </>
          )}
        </Box>
      </Stack>
    </Dialog>
  );
}
