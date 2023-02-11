import React, { useEffect, useLayoutEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

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
import useAuth from 'src/hooks/useAuth';
import LoadingCircular from 'src/sections/connections/listContent/LoadingCircular';
import { GroupCategoryTypeEnum, UserTypeEnum } from 'src/types/serverTypes';

import AfterRegistrationPwaMessages from '../afterRegistrationPwa.messages';
import DialogIconButtons from '../common/DialogIconButtons';
import TitleAndProgress from '../common/TitleAndProgress';

const CheckBoxStyle = styled(FormControlLabel)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4),
  marginLeft: 0,
}));
const CheckBoxGroupStyle = styled(FormGroup)(({ theme }) => ({
  // paddingLeft: theme.spacing(3),
  maxHeight: 224,
  // overflowY: 'scroll',
}));

interface SelectCategoryProps {
  authType?: UserTypeEnum;
  openCategoryDialog?: boolean;
  setOpenCategoryDialog?: React.Dispatch<
    React.SetStateAction<{
      welcome: boolean;
      gender: boolean;
      location: boolean;
      categories: boolean;
      workFields: boolean;
      joinReasons: boolean;
      suggestConnection: boolean;
      endQ: boolean;
    }>
  >;
}

export default function SelectCategory(props: SelectCategoryProps) {
  const { authType, openCategoryDialog, setOpenCategoryDialog } = props;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = React.useState<string[]>([]);

  const [searchCategories, { data, isFetching }] = useLazySearchGroupCategoriesQuery();
  const [upsertIntrestedCategories, { isLoading }] = useUpsertInterestedCategoriesMutation();

  useLayoutEffect(() => {
    if (localStorage.getItem('stepTitle') === 'categories') {
      setOpenCategoryDialog!((prev) => ({ ...prev, categories: true }));
    }
  }, [setOpenCategoryDialog]);

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, categoryId: string) => {
    if (event.target.checked) {
      setCategory((prevcategory) => [...prevcategory, categoryId]);
    } else {
      setCategory((prevcategory) => prevcategory.filter((item) => item !== categoryId));
    }
  };

  const handleSubmitCategories = async () => {
    const res: any = await upsertIntrestedCategories({
      filter: {
        dto: {
          categoryIds: category,
        },
      },
    });
    if (res?.data?.upsertInterestedCategories?.isSuccess) {
      handleRouting();
    }
  };

  const handleRouting = () => {
    setOpenCategoryDialog!((prev) => ({ ...prev, categories: false, suggestConnection: true }));
    localStorage.setItem('stepTitle', 'suggestConnection');
  };

  return (
    <>
      <Dialog fullWidth={true} open={openCategoryDialog as boolean}>
        <DialogTitle>
          <DialogIconButtons router={navigate} user={user} setOpenStatusDialog={setOpenCategoryDialog} hasBackIcon />
          <Stack alignItems="center" mb={4}>
            <TitleAndProgress step={3} userType={authType} />
          </Stack>
          <Stack alignItems="center" mx={-1}>
            <Typography variant="h6" color="text.primary" textAlign="center" mb={2}>
              <FormattedMessage {...AfterRegistrationPwaMessages.interestedCategoryQuestion} />
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Stack alignItems="center">
            {isFetching ? (
              <Box m={1}>
                <LoadingCircular />
              </Box>
            ) : (
              <Box>
                <FormControl component="fieldset">
                  <CheckBoxGroupStyle aria-label="position" row>
                    {data?.searchGroupCategories?.listDto?.items?.map((_category) => (
                      <CheckBoxStyle
                        key={_category?.id}
                        sx={{
                          borderColor:
                            category.findIndex((item) => item === _category?.id) >= 0 ? 'primary.main' : 'grey.100',
                        }}
                        control={
                          <Checkbox
                            checked={category.findIndex((item) => item === _category?.id) >= 0}
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
                        label={_category?.title}
                        labelPlacement="start"
                      />
                    ))}
                  </CheckBoxGroupStyle>
                </FormControl>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack direction="row" spacing={2} justifyContent="flex-end" mx={-1}>
            <Button variant="outlined" sx={{ borderColor: 'grey.300' }} onClick={handleRouting}>
              <Typography color="grey.900">
                <FormattedMessage {...AfterRegistrationPwaMessages.skipButton} />
              </Typography>
            </Button>

            <LoadingButton
              variant="contained"
              color="primary"
              endIcon={<Icon name="right-arrow-1" color="common.white" />}
              onClick={handleSubmitCategories}
              loading={isLoading}
              disabled={!category.length}
            >
              <Typography>
                <FormattedMessage {...AfterRegistrationPwaMessages.nextButton} />
              </Typography>
            </LoadingButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
