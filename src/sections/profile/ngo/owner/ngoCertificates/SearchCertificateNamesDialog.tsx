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
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [searchCertificate, { data: searchCertificateData, isFetching }] = useLazySearchCertificateNamesQuery();
  const [createCertificateName] = useCreateCertificateNameMutation();
  const [isTyping, setIsTyping] = useState(false);
  const userCertificate = useSelector(userCertificateSelector);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userCertificate) navigate(PATH_APP.profile.ngo.certificate.root);
  }, [userCertificate, navigate]);

  const handleChangeInputSearch = (val: string) => {
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    searchCertificate({
      filter: {
        dto: {
          title: val,
        },
      },
    });
  };

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
    navigate(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 320, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...UserCertificates.certificateName} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.ngo.certificate.root}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <AutoCompleteAddable
            // eslint-disable-next-line jsx-a11y/no-autofocus
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
