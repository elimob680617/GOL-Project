import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useCreateConcentrationMutation } from 'src/_graphql/profile/publicDetails/mutations/createConcentraition.generated';
import { useLazySearchConcentrationsQuery } from 'src/_graphql/profile/publicDetails/queries/concentration.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Concentration } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface CollegeConcentrationProps {
  onChange: (value: Concentration) => void;
}

export default function CollegeConcentration(props: CollegeConcentrationProps) {
  const { onChange } = props;
  const [searching, setSearching] = useState<boolean>();
  const { formatMessage } = useIntl();

  // Query
  const [concentration, { data, isFetching }] = useLazySearchConcentrationsQuery();
  // Mutation
  const [createConcentration] = useCreateConcentrationMutation();

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
        const concentrationData = response?.data?.createConcentration?.listDto?.items?.[0];
        onChange({ id: concentrationData?.id, title: concentrationData?.title });
      }
    } else {
      onChange(value);
    }
  };

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

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.concenteration} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack>
        <AutoCompleteAddable
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={data?.concentrations?.listDto?.items || []}
          placeholder={formatMessage(NormalPublicDetailsMessages.concenteration)}
        />
        <Box>
          <Box mt={6} />
          {!searching && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.seconary">
                <FormattedMessage {...NormalPublicDetailsMessages.concentrationSearchMessage} />
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
