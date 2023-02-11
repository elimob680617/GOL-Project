import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useLazySearchCitiesQuery } from 'src/_graphql/locality/queries/searchCities.generated';
import AutoComplete from 'src/components/AutoComplete';
import { PATH_APP } from 'src/routes/paths';
import { useSelector } from 'src/store';
import { userLocationSelector } from 'src/store/slices/profile/userLocation-slice';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../NormalPublicDetailsPwa.messages';

interface SelectCurrentCityProps {
  onChange: (value: { id?: string; name?: string }) => void;
}

function CurrentCity(props: SelectCurrentCityProps) {
  const { onChange } = props;
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const navigate = useNavigate();
  const [searching, setSearching] = useState<boolean>();
  const userCity = useSelector(userLocationSelector);
  const { formatMessage } = useIntl();

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
    onChange({ id: val?.id, name: val?.title });
  };

  useEffect(() => {
    if (!userCity) navigate(PATH_APP.profile.user.publicDetails.root);
  }, [userCity, navigate]);

  const citiesOption = useMemo(
    () => data?.searchCities?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchCities.listDto?.items],
  );

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.currentCity} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <AutoComplete
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={citiesOption || []}
          placeholder={formatMessage(NormalPublicDetailsMessages.currentCity)}
        />
        {!searching && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage {...NormalPublicDetailsMessages.currentCitySearchMessage} />
              </Typography>
            </Box>
          </Box>
        )}
      </Stack>
    </Stack>
  );
}

export default CurrentCity;
