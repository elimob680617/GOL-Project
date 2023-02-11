import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';

import { useLazySearchCitiesQuery } from 'src/_graphql/locality/queries/searchCities.generated';
import AutoComplete from 'src/components/AutoComplete';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { ngoProjectSelector, projectAdded } from 'src/store/slices/profile/ngoProject-slice';
import debounceFn from 'src/utils/debounce';

import NgoProjectMessages from './NgoProject.messages';

function ProjectLocationDialog() {
  const router = useNavigate();
  const dispatch = useDispatch();
  const projectData = useSelector(ngoProjectSelector);
  const [isTyping, setIsTyping] = useState(false);
  const [searchCities, { data, isFetching }] = useLazySearchCitiesQuery();

  useEffect(() => {
    if (!projectData) router(PATH_APP.profile.ngo.project.list);
  }, [projectData, router]);

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
      projectAdded({
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
            <FormattedMessage {...NgoProjectMessages.location} />
          </Typography>
        </Stack>

        <AutoComplete
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={citiesOptions || []}
          // getOptionLabel={option => option.name}
          placeholder="Search"
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage {...NgoProjectMessages.locationSearchMessage} />
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </Dialog>
  );
}

export default ProjectLocationDialog;
