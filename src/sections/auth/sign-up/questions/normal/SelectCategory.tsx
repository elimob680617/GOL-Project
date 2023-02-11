import React, { useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  Stack,
  Typography,
  styled,
} from '@mui/material';

import { useUpsertInterestedCategoriesMutation } from 'src/_graphql/profile/intrestedCategories/mutation/upsertIntrestedCategories.generated';
import { useLazySearchGroupCategoriesQuery } from 'src/_graphql/profile/ngoPublicDetails/queries/searchGroupCategories.generated';
import { Icon } from 'src/components/Icon';
import Loading from 'src/components/Loading';
import useAuth from 'src/hooks/useAuth';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import {
  registerIntrestedCategoriesSelector,
  registerIntrestedCategoriesUpdated,
} from 'src/store/slices/afterRegistration';
import { GroupCategoryTypeEnum, UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationMessages from '../afterRegistration.messages';
import DialogIconButtons from '../common/DialogIconButtons';
import TitleAndProgress from '../common/TitleAndProgress';

const CheckBoxStyle = styled(FormControlLabel)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginInline: theme.spacing(0),
  marginRight: theme.spacing(4),
  padding: 0,
}));
const CheckBoxGroupStyle = styled(FormGroup)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  overflowY: 'hidden',
  '&::-webkit-scrollbar': {
    width: 12,
  },

  '&::-webkit-scrollbar-track': {
    background: theme.palette.grey[0],
    borderRadius: 8,
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[300],
    borderRadius: 10,
    border: `4px solid ${theme.palette.grey[0]}`,
  },
}));

export default function SelectCategory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [viewMore, setViewMore] = React.useState<boolean>(false);
  const [showDialog, setShowDialog] = React.useState<boolean>(true);
  const dispatch = useDispatch();
  const categoriesSelector = useSelector(registerIntrestedCategoriesSelector);

  const [searchCategories, { data, isFetching }] = useLazySearchGroupCategoriesQuery();
  const [upsertIntrestedCategories, { isLoading }] = useUpsertInterestedCategoriesMutation();

  useLayoutEffect(() => {
    if (pathname === 'categories' && user?.completeQar) {
      // if (navigate.query.index?.[0] === 'categories' && user?.completeQar) {
      setShowDialog(false);
      navigate(PATH_APP.home.index);
    }
    if (user?.userType !== UserTypeEnum.Normal) {
      navigate(PATH_APP.home.afterRegister.welcome);
    } else {
      searchCategories({
        filter: {
          dto: {
            title: '',
            groupCategoryType: GroupCategoryTypeEnum.Category,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate, searchCategories]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    if (event.target.checked) {
      // setCategory((prevcategory) => [...prevcategory, categoryId]);
      dispatch(registerIntrestedCategoriesUpdated([...(categoriesSelector as string[]), categoryId]));
    } else {
      // setCategory((prevcategory) => prevcategory.filter((item) => item !== categoryId));
      dispatch(
        registerIntrestedCategoriesUpdated((categoriesSelector as string[]).filter((item) => item !== categoryId)),
      );
    }
  };

  const handleSubmitCategories = async () => {
    const res: any = await upsertIntrestedCategories({
      filter: {
        dto: {
          categoryIds: categoriesSelector,
        },
      },
    });
    if (res?.data?.upsertInterestedCategories?.isSuccess) {
      handleRouting();
    }
  };

  const handleRouting = () => {
    navigate(PATH_APP.home.afterRegister.connections);
  };

  return (
    <Dialog fullWidth={true} open={showDialog}>
      <DialogTitle>
        <DialogIconButtons router={navigate} user={user} hasBackIcon />
        <Stack alignItems="center" mt={-5}>
          <TitleAndProgress step={3} userType={user?.userType as UserTypeEnum} />
        </Stack>
        <Stack alignItems="center" mb={3}>
          <Typography variant="h6" color="text.primary">
            <FormattedMessage {...AfterRegistrationMessages.interestedCategoryQuestion} />
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center" mb={2}>
          {isFetching ? (
            <Box m={1}>
              <Loading />
            </Box>
          ) : (
            <Box>
              <FormControl component="fieldset">
                <CheckBoxGroupStyle aria-label="position" row sx={{ maxHeight: viewMore ? 350 : 240 }}>
                  {data?.searchGroupCategories?.listDto?.items?.map((_category) => (
                    <CheckBoxStyle
                      key={_category?.id}
                      control={
                        <Checkbox
                          checked={
                            (categoriesSelector?.findIndex((item: any) => item === _category?.id) as number) >= 0
                          }
                          sx={{
                            color: 'grey.300',
                            '&.Mui-checked': {
                              '&, & + .MuiFormControlLabel-label': {
                                color: 'primary.main',
                              },
                            },
                          }}
                          onClick={(e) => {
                            handleChange(e as any, _category?.id);
                          }}
                        />
                      }
                      label={_category?.title as string}
                    />
                  ))}
                </CheckBoxGroupStyle>
              </FormControl>
            </Box>
          )}
        </Stack>
        <Box pl={3}>
          {!viewMore && !isFetching && (
            <Button
              variant="text"
              color="primary"
              onClick={() => {
                setViewMore(true);
              }}
              sx={{ height: 24 }}
            >
              <Icon name="down-arrow" color="primary.main" />
              <Typography>
                <FormattedMessage {...AfterRegistrationMessages.viewMoreButton} />
              </Typography>
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end" mx={3}>
          <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
            <Typography color="grey.900">
              <FormattedMessage {...AfterRegistrationMessages.skipButton} />
            </Typography>
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            endIcon={<Icon name="right-arrow-1" color="common.white" />}
            onClick={handleSubmitCategories}
            loading={isLoading}
            disabled={!!!categoriesSelector?.length}
          >
            <Typography>
              <FormattedMessage {...AfterRegistrationMessages.nextButton} />
            </Typography>
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
