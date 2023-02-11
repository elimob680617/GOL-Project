import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useCreateSchoolMutation } from 'src/_graphql/profile/publicDetails/mutations/createSchool.generated';
import { useLazySearchSchoolsQuery } from 'src/_graphql/profile/publicDetails/queries/searchSchools.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { School } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

interface SchoolNameProps {
  onChange: (value: any) => void;
}

export default function SchoolName(props: SchoolNameProps) {
  const { onChange } = props;
  const [searching, setSearching] = useState<boolean>();
  const { formatMessage } = useIntl();

  // Query
  const [searchSchool, { data: searchSchoolName, isFetching }] = useLazySearchSchoolsQuery();

  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchSchool({
          filter: {
            dto: {
              title: val,
            },
          },
        }),
      );
  };

  // Mutation
  const [createSchool] = useCreateSchoolMutation();

  const handleChange = async (value: School & { inputValue?: string }) => {
    if (value.inputValue) {
      //add mutation func
      const response: any = await createSchool({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (response?.data?.createSchool?.isSuccess) {
        const data = response?.data?.createSchool?.listDto?.items?.[0];
        onChange({
          id: data.id,
          title: data.title,
        });
      }
    } else {
      onChange(value);
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3, minHeight: 320 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.highSchoolName} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack>
        <AutoCompleteAddable
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={searchSchoolName?.searchSchools?.listDto?.items || []}
          placeholder={formatMessage(NormalPublicDetailsMessages.schoolName)}
        />
        <Box>
          <Box mt={6} />
          {!searching && (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.seconary">
                <FormattedMessage {...NormalPublicDetailsMessages.schoolSearchMessage} />
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
