import { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useCreateCollegeMutation } from 'src/_graphql/profile/publicDetails/mutations/createCollege.generated';
import { useLazySearchCollegesQuery } from 'src/_graphql/profile/publicDetails/queries/searchColleges.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Icon } from 'src/components/Icon';
import { useDispatch } from 'src/store';
import { userCollegeUpdated } from 'src/store/slices/profile/userColloges-slice';
import { InstituteTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NormalPublicDetailsMessages from '../../NormalPublicDetails.messages';

type collegeType = {
  id: string;
  title?: string;
};
export default function CollegeNameDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const [searching, setSearching] = useState<boolean>();
  const [searchCollege, { data, isFetching }] = useLazySearchCollegesQuery();
  const [createCollege] = useCreateCollegeMutation();

  const searchCollegeName = useMemo(
    () =>
      data?.searchColleges?.listDto?.items?.map((item) => ({
        id: item?.id,
        title: item?.name,
      })),
    [data?.searchColleges?.listDto?.items],
  );

  const handleInputChange = (val: string) => {
    setSearching(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchCollege({
          filter: {
            dto: {
              name: val,
              instituteType: InstituteTypeEnum.College,
            },
          },
        }),
      );
  };

  const dispatch = useDispatch();
  const handleChange = async (value: collegeType & { inputValue?: string }) => {
    if (value.inputValue) {
      const response: any = await createCollege({
        filter: {
          dto: {
            name: value.inputValue,
            instituteType: InstituteTypeEnum.College,
          },
        },
      });
      if (response?.data?.createCollege?.isSuccess) {
        const collegeData = response?.data?.createCollege?.listDto?.items?.[0];
        dispatch(
          userCollegeUpdated({
            collegeDto: { id: collegeData.id, name: collegeData.name },
            isChange: true,
          }),
        );
        navigate(-1);
      }
    } else {
      dispatch(
        userCollegeUpdated({
          collegeDto: { id: value.id, name: value.title },
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
              <FormattedMessage {...NormalPublicDetailsMessages.collegeName} />
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
            onInputChange={(ev, val) => handleInputChange(val)}
            onChange={(ev, val) => handleChange(val)}
            options={searchCollegeName || []}
            placeholder={formatMessage(NormalPublicDetailsMessages.collegeName)}
          />
          <Box>
            <Box mt={6} />
            {!searching && (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.seconary">
                  <FormattedMessage {...NormalPublicDetailsMessages.collegeSearchMessage} />
                </Typography>
              </Box>
            )}
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}
