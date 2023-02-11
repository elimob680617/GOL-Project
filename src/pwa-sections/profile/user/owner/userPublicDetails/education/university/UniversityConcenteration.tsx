import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useCreateConcentrationMutation } from 'src/_graphql/profile/publicDetails/mutations/createConcentraition.generated';
import { useLazySearchConcentrationsQuery } from 'src/_graphql/profile/publicDetails/queries/concentration.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Concentration } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface ConcentrationProps {
  onChange: (value: Concentration) => void;
}

export default function UniversityConcentration(props: ConcentrationProps) {
  const { onChange } = props;
  const [searching, setSearching] = useState<boolean>();
  const { formatMessage } = useIntl();

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
  //Mutation
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
        const uniData = response?.data?.createConcentration?.listDto?.items?.[0];
        onChange({ id: uniData?.id, title: uniData?.title });
      }
    } else {
      onChange(value);
    }
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
      <Stack sx={{ px: 2 }}>
        <AutoCompleteAddable
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
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
  );
}
