// @mui
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';

import { useLazySearchCitiesQuery } from 'src/_graphql/locality/queries/searchCities.generated';
import AutoComplete from 'src/components/AutoComplete';
import { useSelector } from 'src/store';
import { userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import debounceFn from 'src/utils/debounce';

import ExprienceMessages from './ExpriencePwa.messages';

interface LocationProps {
  onChange: (value: { id?: string; name?: string }) => void;
}

function ExperienceLocation(props: LocationProps) {
  const { onChange } = props;
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) navigate('/profile/user/experience/list');
  }, [experienceData, navigate]);

  const handleInputChange = (val: string) => {
    setIsTyping(!!val.length);
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

  const handleChange = (val: { title: string; id: string }) => {
    onChange({ id: val.id, name: val.title });
  };

  const citiesOptions = useMemo(
    () => data?.searchCities?.listDto?.items?.map((_) => ({ id: _?.id, title: _?.name })),
    [data?.searchCities?.listDto?.items],
  );

  return (
    <>
      <Stack spacing={2} sx={{ px: 2, py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2" color="text.primary">
            <FormattedMessage {...ExprienceMessages.location} />
          </Typography>
        </Stack>

        <AutoComplete
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={citiesOptions || []}
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
    </>
  );
}

export default ExperienceLocation;
