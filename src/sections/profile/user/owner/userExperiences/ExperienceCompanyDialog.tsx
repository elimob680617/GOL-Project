import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Dialog, IconButton, Stack, Typography } from '@mui/material';

import { useCreateCompanyMutation } from 'src/_graphql/profile/experiences/mutations/createCompany.generated';
import { useLazySearchCompaniesQuery } from 'src/_graphql/profile/experiences/queries/searchCompanies.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Icon } from 'src/components/Icon';
import { useDispatch, useSelector } from 'src/store';
import { experienceAdded, userExperienceSelector } from 'src/store/slices/profile/userExperiences-slice';
import { Company } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import ExprienceMessages from './Exprience.messages';

function ExperienceCompanyDialog() {
  const [searchCompany, { data: companyData, isFetching }] = useLazySearchCompaniesQuery();
  const [isTyping, setIsTyping] = useState(false);
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const experienceData = useSelector(userExperienceSelector);

  useEffect(() => {
    if (!experienceData) router('/profile/experience-list');
  }, [experienceData, router]);

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
          const data = res?.data?.createCompany?.listDto?.items?.[0];
          dispatch(
            experienceAdded({
              companyDto: {
                id: data.id,
                title: data.title,
              },
              isChange: true,
            }),
          );

          router(-1);
        }
      });
    } else {
      dispatch(
        experienceAdded({
          companyDto: val,
          isChange: true,
        }),
      );
      router(-1);
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ px: 2, py: 3, minHeight: 320 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
            <Icon name="left-arrow-1" />
          </IconButton>
          <Typography variant="subtitle2" color="text.primary">
            <FormattedMessage {...ExprienceMessages.companyName} />
          </Typography>
        </Stack>

        <AutoCompleteAddable
          autoFocus
          loading={isFetching}
          onInputChange={(ev, val) => handleInputChange(val)}
          onChange={(ev, val) => handleChange(val)}
          options={isTyping ? companyData?.searchCompanies?.listDto?.items || [] : []}
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
    </Dialog>
  );
}

export default ExperienceCompanyDialog;
