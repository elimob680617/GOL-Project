import { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useLazySearchGroupCategoriesQuery } from 'src/_graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';
import { Icon } from 'src/components/Icon';
import Loading from 'src/components/Loading';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch } from 'src/store';
import { ngoCategoryUpdated } from 'src/store/slices/profile/ngoPublicDetails-slice';
import { GroupCategoryTypeEnum } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

function CategoryTypeDialog() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [searchCategories, { data, isFetching }] = useLazySearchGroupCategoriesQuery();

  const handleInputChange = (value: string) => {
    debounceFn(() =>
      searchCategories({
        filter: {
          dto: {
            title: value,
            groupCategoryType: GroupCategoryTypeEnum.Category,
          },
        },
      }),
    );
  };

  const handleChange = (value: any & { inputValue?: string }) => {
    dispatch(
      ngoCategoryUpdated({
        id: value.id,
        title: value.title,
        iconUrl: value.iconUrl,
        isChange: true,
      }),
    );
    navigate(-1);
  };

  useEffect(() => {
    searchCategories({
      filter: {
        dto: {
          title: '',
          groupCategoryType: GroupCategoryTypeEnum.Category,
        },
      },
    });
  }, [searchCategories]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ minHeight: 320, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoCategoryTitle} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.ngo.publicDetails.ngoCategory.root}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} px={2}>
          <TextField
            size="small"
            onChange={(e) => {
              handleInputChange((e.target as HTMLInputElement).value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ marginRight: 1 }}>
                    <Icon name="Research" type="solid" size={20} />
                  </Box>
                </InputAdornment>
              ),
            }}
            variant="outlined"
            placeholder={formatMessage(NgoPublicDetailsMessages.ngoCategoryTitle)}
          />
          <Box>
            {isFetching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Loading />
              </Box>
            ) : (
              <>
                {data?.searchGroupCategories?.listDto?.items?.map((_category) => (
                  <Stack key={_category?.id} direction="row" spacing={1} mb={2}>
                    <img
                      src={_category?.iconUrl || undefined}
                      width={24}
                      height={24}
                      alt=""
                      style={{ marginRight: 8 }}
                    />
                    <Typography onClick={() => handleChange(_category)} sx={{ cursor: 'pointer' }}>
                      {_category?.title}
                    </Typography>
                  </Stack>
                ))}
              </>
            )}
          </Box>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default CategoryTypeDialog;
