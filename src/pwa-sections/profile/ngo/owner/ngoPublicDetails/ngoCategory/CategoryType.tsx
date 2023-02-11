import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, CircularProgress, Divider, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useLazySearchGroupCategoriesQuery } from 'src/_graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';
import { GroupCategoryTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';

interface SelectCategoryType {
  onChange: (value: { id?: string; title?: string; iconUrl?: string }) => void;
}

function CategoryType(props: SelectCategoryType) {
  const { onChange } = props;
  const [, setSearching] = useState<boolean>();
  // const { id } = useParams();
  // const id = router?.query?.id?.[0];
  // const isEdit = !!id;
  const { formatMessage } = useIntl();

  const [getCategoryType, { data, isFetching }] = useLazySearchGroupCategoriesQuery();

  const handleInputChange = (val: string) => {
    if (!!val) {
      setSearching(true);
    } else {
      setSearching(false);
    }
    debounceFn(() =>
      getCategoryType({
        filter: {
          dto: {
            title: val,
            groupCategoryType: GroupCategoryTypeEnum?.Category,
          },
        },
      }),
    );
  };

  const handleChange = (val: any) => {
    onChange({ id: val?.id, title: val?.title, iconUrl: val?.iconUrl });
  };

  useEffect(() => {
    getCategoryType({
      filter: {
        dto: {
          title: '',
          groupCategoryType: GroupCategoryTypeEnum.Category,
        },
      },
    });
  }, []);

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NgoPublicDetailsMessages.ngoCategoryTitle} />
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        <TextField
          size="small"
          onChange={(e) => {
            handleInputChange((e.target as HTMLInputElement).value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <img
                  src="/icons/Research/Outline.svg"
                  width={20}
                  height={20}
                  alt="research"
                  style={{ marginRight: 8 }}
                />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          placeholder={formatMessage(NgoPublicDetailsMessages.ngoCategoryTitle)}
        />
        {isFetching ? (
          <CircularProgress size={20} />
        ) : (
          <>
            {data?.searchGroupCategories?.listDto?.items?.map((type) => (
              <Typography key={type?.id} onClick={() => handleChange(type)}>
                {type?.title}
              </Typography>
            ))}
          </>
        )}
      </Stack>
    </Stack>
  );
}

export default CategoryType;
