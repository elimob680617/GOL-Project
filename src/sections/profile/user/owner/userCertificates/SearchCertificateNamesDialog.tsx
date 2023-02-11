import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useCreateCertificateNameMutation } from 'src/_graphql/profile/certificates/mutations/createCertificateName.generated';
import { useLazySearchCertificateNamesQuery } from 'src/_graphql/profile/certificates/queries/searchCertificateNames.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import UserCertificates from 'src/sections/profile/UserCertificates.messages';
import { useDispatch, useSelector } from 'src/store';
import { certificateUpdated, userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';
import { CertificateName } from 'src/types/serverTypes';

function SearchCertificateNamesDialog() {
  const [searchCertificate, { data: searchCertificateData, isFetching }] = useLazySearchCertificateNamesQuery();
  const [createCertificateName] = useCreateCertificateNameMutation();
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const [isTyping, setIsTyping] = useState(false);
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();

  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) router(PATH_APP.profile.user.certificate.root);
  }, [userCertificate, router]);

  const handleChangeInputSearch = (val: string) => {
    // is typing status
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    // Query
    searchCertificate({
      filter: {
        dto: {
          title: val,
        },
      },
    });
  };

  // send certificateName to server
  const handleChange = async (value: CertificateName & { inputValue: string }) => {
    if (value.inputValue) {
      const resData: any = await createCertificateName({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (resData?.data?.createCertificateName?.isSuccess) {
        const newData = resData?.data?.createCertificateName?.listDto?.items?.[0];
        dispatch(
          certificateUpdated({
            certificateName: { id: newData?.id, title: newData?.title },
            isChange: true,
          }),
        );
      }
    } else {
      dispatch(
        certificateUpdated({
          certificateName: value,
          isChange: true,
        }),
      );
    }
    router(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 320, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...UserCertificates.certificateName} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.user.certificate.root}>
            <IconButton>
              <Icon name="Close" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <AutoCompleteAddable
            autoFocus
            loading={isFetching}
            onInputChange={(ev, val) => handleChangeInputSearch(val)}
            onChange={(ev, val) => handleChange(val)}
            options={searchCertificateData?.searchCertificateNames?.listDto?.items || []}
            placeholder={formatMessage(UserCertificates.certificateName)}
          />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              {!isTyping && (
                <Typography color="text.secondary" variant="body2">
                  <FormattedMessage {...UserCertificates.startType} />
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default SearchCertificateNamesDialog;
