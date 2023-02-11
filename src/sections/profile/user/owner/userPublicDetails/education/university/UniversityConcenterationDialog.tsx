import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useCreateConcentrationMutation } from 'src/_graphql/profile/publicDetails/mutations/createConcentraition.generated';
import { useLazySearchConcentrationsQuery } from 'src/_graphql/profile/publicDetails/queries/concentration.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Icon } from 'src/components/Icon';
import { useDispatch } from 'src/store';
import { userUniversityUpdated } from 'src/store/slices/profile/userUniversity-slice';
import { Concentration } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function UniversityConcenterationDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [searching, setSearching] = useState<boolean>();
  const [concentration, { data, isFetching }] = useLazySearchConcentrationsQuery();
  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        concentration({
          filter: {
            dto: {
              title: val,
            },
          },
        }),
      );
  };
  const [createConcentration] = useCreateConcentrationMutation();
  const dispatch = useDispatch();
  const handleChange = async (value: Concentration & { inputValue: string }) => {
    if (value.inputValue) {
      const response: any = await createConcentration({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (response?.data?.createConcentration?.isSuccess) {
        const uniData = response?.data?.createConcentration?.listDto?.items?.[0];
        dispatch(
          userUniversityUpdated({
            concentrationDto: { id: uniData?.id, title: uniData?.title },
            isChange: true,
          }),
        );
        navigate(-1);
      }
    } else {
      dispatch(
        userUniversityUpdated({
          concentrationDto: value,
          isChange: true,
        }),
      );
      navigate(-1);
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
          <Stack direction="row" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.concenteration} />
            </Typography>
          </Stack>
          <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
            <Icon name="Close-1" color="text.primary" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ px: 2 }}>
          <AutoCompleteAddable
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            loading={isFetching}
            onInputChange={(ev: any, val: string) => handleInputChange(val)}
            onChange={(ev: any, val: any) => handleChange(val)}
            options={data?.concentrations?.listDto?.items || []}
            placeholder={formatMessage(NormalPublicDetailsMessages.concenteration)}
          />
          <Box>
            <Box mt={6} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {!searching && (
                <Typography variant="body2" color="text.seconary">
                  <FormattedMessage {...NormalPublicDetailsMessages.concentrationSearchMessage} />
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
