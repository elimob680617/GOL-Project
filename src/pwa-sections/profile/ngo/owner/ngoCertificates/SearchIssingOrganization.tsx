import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useCreateIssuingOrganizationMutation } from 'src/_graphql/profile/certificates/mutations/createIssuingOrganization.generated';
import { useLazySearchIssuingOrganizationsQuery } from 'src/_graphql/profile/certificates/queries/searchIssuingOrganizations.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import UserCertificates from 'src/pwa-sections/profile/UserCertificatesPwa.messages';
import { useSelector } from 'src/store';
import { userCertificateSelector } from 'src/store/slices/profile/userCertificates-slice';
import { IssuingOrganization } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

// type of IssueProps
interface IssueOrganizationProps {
  onChange: (value: IssuingOrganization) => void;
}

function SearchIssingOrganization(props: IssueOrganizationProps) {
  const { onChange } = props;
  const [isTyping, setIsTyping] = useState(false);
  const [searchIssuing, { data: searchIssuingData, isFetching }] = useLazySearchIssuingOrganizationsQuery();
  const [createIssuingOrganization] = useCreateIssuingOrganizationMutation();
  const navigate = useNavigate();
  const userCertificate = useSelector(userCertificateSelector);
  const { formatMessage } = useIntl();
  // useEffect for Refreshing
  useEffect(() => {
    if (!userCertificate) navigate(-1);
  }, [userCertificate, navigate]);

  const handleChangeInputSearch = (val: string) => {
    // is typing status
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    // Query
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

        onChange({ id: newData?.id, title: newData?.title });
      }
    } else {
      onChange(value);
    }
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...UserCertificates.Issueingorganization} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <AutoCompleteAddable
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleChangeInputSearch(val)}
          onChange={(ev, val) => handleChange(val)}
          options={searchIssuingData?.searchIssuingOrganizations?.listDto?.items || []}
          placeholder={formatMessage(UserCertificates.Issueingorganization)}
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
  );
}

export default SearchIssingOrganization;
