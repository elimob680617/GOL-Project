import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useCreateIssuingOrganizationMutation } from 'src/_graphql/profile/certificates/mutations/createIssuingOrganization.generated';
import { useLazySearchIssuingOrganizationsQuery } from 'src/_graphql/profile/certificates/queries/searchIssuingOrganizations.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';
import UserCertificates from 'src/sections/profile/UserCertificates.messages';
import { useDispatch, useSelector } from 'src/store';
import { certificateUpdated, userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';
import { IssuingOrganization } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

function SearchIssingOrganization() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userCertificate = useSelector(userCertificateSelector);
  const [isTyping, setIsTyping] = useState(false);
  const [searchIssuing, { data: searchIssuingData, isFetching }] = useLazySearchIssuingOrganizationsQuery();
  const [createIssuingOrganization] = useCreateIssuingOrganizationMutation();

  useEffect(() => {
    if (!userCertificate) navigate(PATH_APP.profile.ngo.certificate.root);
  }, [userCertificate, navigate]);

  const handleChangeInputSearch = (val: string) => {
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    if (val.length > 2)
      debounceFn(() =>
        searchIssuing({
          filter: {
            dto: {
              title: val,
            },
          },
        }),
      );
  };

  const handleChange = async (value: IssuingOrganization & { inputValue?: string }) => {
    if (value.inputValue) {
      // mutation create Issuing Organization name
      const resData: any = await createIssuingOrganization({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (resData?.data?.createIssuingOrganization?.isSuccess) {
        const newData = resData?.data?.createIssuingOrganization?.listDto?.items?.[0];
        dispatch(
          certificateUpdated({
            issuingOrganization: { id: newData?.id, title: newData?.title },
            isChange: true,
          }),
        );
      }
    } else {
      dispatch(
        certificateUpdated({
          issuingOrganization: value,
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
              <FormattedMessage {...UserCertificates.organization} />
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
            options={searchIssuingData?.searchIssuingOrganizations?.listDto?.items || []}
            placeholder={formatMessage(UserCertificates.organization)}
          />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              {!isTyping && (
                <Typography color="text.secondary" variant="body2">
                  <FormattedMessage {...UserCertificates.startTypeOrg} />
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default SearchIssingOrganization;
