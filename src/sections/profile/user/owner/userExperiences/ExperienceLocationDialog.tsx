// @mui
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
// components
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';

import { useLazySearchCitiesQuery } from 'src/_graphql/locality/queries/searchCities.generated';
import AutoComplete from 'src/components/AutoComplete';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { experienceAdded, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import debounceFn from 'src/utils/debounce';

import ExprienceMessages from './Exprience.messages';

function ExperienceLocationDialog() {
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const [isTyping, setIsTyping] = useState(false);
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router(PATH_APP.profile.user.experience.root);
  }, [experienceData, router]);

  const handleInputChange = (val: string) => {
    setIsTyping(!!val.length);
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

  const handleChange = (val: { title: string; id: string }) => {
    dispatch(
      experienceAdded({
        cityDto: { id: val.id, name: val.title },
        isChange: true,
      }),
    );
    router(-1);
  };

  const citiesOptions = useMemo(
    () => data?.searchCities?.listDto?.items?.map((_) => ({ id: _?.id, title: _?.name })),
    [data?.searchCities?.listDto?.items],
  );

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ px: 2, py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
            <Icon name="left-arrow-1" />
          </IconButton>
          <Typography variant="subtitle2" color="text.primary">
            <FormattedMessage {...ExprienceMessages.location} />
          </Typography>
        </Stack>

        <AutoComplete
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={citiesOptions || []}
          // getOptionLabel={option => option.name}
          placeholder={formatMessage(ExprienceMessages.search)}
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage {...ExprienceMessages.typeToFindLocationName} />
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Dialog>
  );
}

export default ExperienceLocationDialog;
