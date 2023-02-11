import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useCreateSchoolMutation } from 'src/_graphql/profile/publicDetails/mutations/createSchool.generated';
import { useLazySearchSchoolsQuery } from 'src/_graphql/profile/publicDetails/queries/searchSchools.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Icon } from 'src/components/Icon';
import { useDispatch } from 'src/store';
import { userSchoolUpdated } from 'src/store/slices/profile/userSchool-slice';
import { School } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

export default function SchoolNameDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [searching, setSearching] = useState<boolean>();
  const dispatch = useDispatch();
  const [createSchool] = useCreateSchoolMutation();
  const [searchSchool, { data: searchSchoolData, isFetching }] = useLazySearchSchoolsQuery();

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

  const handleChange = async (value: School & { inputValue?: string }) => {
    if (value.inputValue) {
      const response: any = await createSchool({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (response?.data?.createSchool?.isSuccess) {
        const resData = response?.data?.createSchool?.listDto?.items?.[0];
        dispatch(
          userSchoolUpdated({
            school: {
              id: resData.id,
              title: resData.title,
            },
            isChange: true,
          }),
        );
        navigate(-1);
      }
    } else {
      dispatch(
        userSchoolUpdated({
          school: value,
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
              <FormattedMessage {...NormalPublicDetailsMessages.highSchoolName} />
            </Typography>
          </Stack>
          <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
            <Icon name="Close-1" color="text.primary" />
          </IconButton>
        </Stack>
        <Divider />
        <Stack sx={{ px: 2 }}>
          <AutoCompleteAddable
            autoFocus
            loading={isFetching}
            onInputChange={(ev: any, val: string) => handleInputChange(val)}
            onChange={(ev: any, val: School & { inputValue?: string | undefined }) => handleChange(val)}
            options={searchSchoolData?.searchSchools?.listDto?.items || []}
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
    </Dialog>
  );
}
