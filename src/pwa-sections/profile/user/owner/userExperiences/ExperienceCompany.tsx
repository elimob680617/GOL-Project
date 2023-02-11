import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Stack, Typography } from '@mui/material';

import { useCreateCompanyMutation } from 'src/_graphql/profile/experiences/mutations/createCompany.generated';
import { useLazySearchCompaniesQuery } from 'src/_graphql/profile/experiences/queries/searchCompanies.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { useSelector } from 'src/store';
import { userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import { Company } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import ExprienceMessages from './ExpriencePwa.messages';

// Type of company props;
interface CompanyProps {
  onChange: (value: Company) => void;
}

function ExperienceCompany(props: CompanyProps) {
  const { onChange } = props;
  const [searchCompany, { data, isFetching }] = useLazySearchCompaniesQuery();
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const experienceData = useSelector(userExperienceSelector);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!experienceData) navigate('/profile/user/experience/list');
  }, [experienceData, navigate]);

  const [createCompany] = useCreateCompanyMutation();

  const handleInputChange = (val: string) => {
    setIsTyping(!!val.length);
    if (val.length > 2)
      debounceFn(() =>
        searchCompany({
          filter: {
            dto: {
              title: val,
            },
          },
        }),
      );
  };

  const handleChange = (val: Company & { inputValue?: string }) => {
    if (val?.inputValue) {
      //addable
      createCompany({
        filter: {
          dto: {
            title: val.inputValue,
          },
        },
      }).then((res: any) => {
        if (res?.data?.createCompany?.isSuccess) {
          const companyData = res?.data?.createCompany?.listDto?.items?.[0];
          onChange({ id: companyData.id, title: companyData.title });
        }
      });
    } else {
      onChange(val);
    }
  };

  return (
    <>
      <Stack spacing={2} sx={{ px: 2, py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle2" color="text.primary">
            <FormattedMessage {...ExprienceMessages.companyName} />
          </Typography>
        </Stack>
        <AutoCompleteAddable
          loading={isFetching}
          onInputChange={(ev: any, val: string) => handleInputChange(val)}
          onChange={(ev: any, val: Company & { inputValue?: string | undefined }) => handleChange(val)}
          options={isTyping ? data?.searchCompanies?.listDto?.items || [] : []}
          placeholder={formatMessage(ExprienceMessages.search)}
        />
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 7 }}>
            {!isTyping && (
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage {...ExprienceMessages.typeToFindCompanyName} />
              </Typography>
            )}
          </Box>
        </Box>
      </Stack>
    </>
  );
}

export default ExperienceCompany;
