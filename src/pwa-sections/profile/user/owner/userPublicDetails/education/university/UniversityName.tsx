import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useCreateCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/createCollege.generated';
import { useLazySearchCollegesQuery } from 'src/_graphql/profile/publicDetails/queries/searchColleges.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { InstituteTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../../NormalPublicDetailsPwa.messages';

type collegeType = {
  id: string;
  title?: string;
};

interface UniNameProps {
  onChange: (value: { id: string; name?: string }) => void;
}

export default function UniversityName(props: UniNameProps) {
  const { onChange } = props;
  const [searching, setSearching] = useState<boolean>();
  const { formatMessage } = useIntl();

  //Mutation
  const [createUniversity] = useCreateCollegeMutation();

  //query
  const [searchCollege, { data, isFetching }] = useLazySearchCollegesQuery();
  const searchUniName = useMemo(
    () => data?.searchColleges?.listDto?.items?.map((item) => ({ id: item?.id, title: item?.name })),
    [data?.searchColleges?.listDto?.items],
  );
  //get Query
  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchCollege({
          filter: {
            dto: {
              name: val,
              instituteType: InstituteTypeEnum.University,
            },
          },
        }),
      );
  };

  const handleChange = async (value: collegeType & { inputValue: string }) => {
    if (value.inputValue) {
      //mutation create university name
      const response: any = await createUniversity({
        filter: {
          dto: {
            name: value.inputValue,
            instituteType: InstituteTypeEnum.University,
          },
        },
      });
      if (response?.data?.createCollege?.isSuccess) {
        const uniData = response?.data?.createCollege?.listDto?.items?.[0];

        onChange({ id: uniData.id, name: uniData.name });
      }
    } else {
      onChange({ id: value.id, name: value?.title });
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2, justifyContent: 'space-between' }} alignItems="center">
        <Stack direction="row" spacing={2}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.universityName} />
          </Typography>
        </Stack>
      </Stack>
      <Divider />
      <Stack sx={{ px: 2 }}>
        <AutoCompleteAddable
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={searchUniName || data?.searchColleges?.listDto?.items || []}
          placeholder={formatMessage(NormalPublicDetailsMessages.universityName)}
        />

        {!searching && (
          <>
            <Box mt={6} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.seconary">
                <FormattedMessage {...NormalPublicDetailsMessages.universitySearchMessage} />
              </Typography>
            </Box>
          </>
        )}
      </Stack>
    </Stack>
  );
}
