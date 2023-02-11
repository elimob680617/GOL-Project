import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useLazySearchCitiesQuery } from 'src/_graphql/locality/queries/searchCities.generated';
import AutoComplete from 'src/components/AutoComplete';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { userLocationSelector, userLocationUpdated } from 'src/store/slices/profile/userLocation-slice';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../NormalPublicDetails.messages';

function HomeTown() {
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [searching, setSearching] = useState<boolean>();
  const userCity = useSelector(userLocationSelector);

  const handleInputChange = (val: string) => {
    if (!!val) {
      setSearching(true);
    } else {
      setSearching(false);
    }
    if (val.length > 2)
      debounceFn(() =>
        searchCities({
          filter: {
            dto: {
              seearchValue: val,
            },
          },
        }),
      );
  };

  const handleChange = (val: any) => {
    dispatch(
      userLocationUpdated({
        city: { id: val?.id, name: val?.title },
        isChange: true,
      }),
    );
    navigate(-1);
  };

  useEffect(() => {
    if (!userCity) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userCity, navigate]);

  const citiesOption = useMemo(
    () => data?.searchCities?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchCities.listDto?.items],
  );

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 320, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.homeTown} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.user.publicDetails.homeTown.discard}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <AutoComplete
            autoFocus
            loading={isFetching}
            onInputChange={(ev, val) => handleInputChange(val)}
            onChange={(ev, val) => handleChange(val)}
            options={citiesOption || []}
            placeholder={formatMessage(NormalPublicDetailsMessages.homeTown)}
          />
          {!searching && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Typography color="text.secondary" variant="body2">
                  <FormattedMessage {...NormalPublicDetailsMessages.homeTownSearchMessage} />
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default HomeTown;
