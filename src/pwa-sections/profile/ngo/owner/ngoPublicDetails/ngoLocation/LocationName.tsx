import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useLazySearchPlacesQuery } from 'src/_graphql/locality/queries/searchPlaces.generated';
import { Icon } from 'src/components/Icon';
import { useDispatch } from 'src/store';
import { ngoPlaceUpdated } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { RestrictionTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';

export default function LocationName() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const [searchPlaces, { data, isFetching }] = useLazySearchPlacesQuery();

  const handleInputChange = (val: string) => {
    // setSearching(!!val.length);
    if (val.length > 1) {
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
    dispatch(
      ngoPlaceUpdated({
        placeId: value.placeId,
        description: value.description,
        mainText: value.structuredFormatting?.mainText,
        isChange: true,
      }),
    );
    navigate(-1);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
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
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img
                  src="/icons/Research/Outline.svg"
                  width={20}
                  height={20}
                  alt="research"
                  style={{ marginRight: 8 }}
                />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          placeholder={formatMessage(NgoPublicDetailsMessages.searchPlaceholder)}
        />
      </Stack>
      <Box>
        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <>
            {data?.searchPlaces?.listDto?.items?.[0]?.predictions?.map((place) => (
              <>
                <Stack key={place?.placeId} direction="row" spacing={1} p={2} onClick={() => handleChange(place)}>
                  <Box />
                  <Stack spacing={0.5}>
                    <Typography>{place?.structuredFormatting?.mainText}</Typography>
                    <Typography>{place?.description}</Typography>
                  </Stack>
                </Stack>
                <Divider />
              </>
            ))}
          </>
        )}
      </Box>
    </Stack>
  );
}
