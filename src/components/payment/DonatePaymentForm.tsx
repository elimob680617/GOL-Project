import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { useForm } from 'react-hook-form';

import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  formControlLabelClasses,
  styled,
} from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Icon } from '../Icon';
import { FormProvider, RHFCheckbox, RHFTextField } from '../hook-form';
import DonateSummaryBox from './DonateSummaryBox';
import TermAndConditions from './TermAndConditions';

const donationAmountArrays = ['$20', '$50', '$100', '$150', '$200'];

/* #region  Types */
export type PaymentDataType = {
  donationAmount: string;
  desiredAmount: number;
  tipAmount?: number;
  donateAnonymously?: boolean;
  termsAndConditions: boolean;
};
/* #endregion */

/* #region  styleComponents */
const TextFieldStyled = styled(RHFTextField)(({ theme }) => ({
  height: 40,
  borderRadius: theme.spacing(1),
  borderColor: theme.palette.grey[300],
  '& label.Mui-focused': {
    color: theme.palette.grey[900],
  },
  '& label.Mui-error': {
    color: theme.palette.error.main,
  },
  '& .MuiOutlinedInput-input': {
    padding: '11px 0px',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.grey[300],
      color: theme.palette.grey[900],
    },
    '&.Mui-error fieldset': { borderColor: theme.palette.error.main },

    pl: 2,
  },
  '& .MuiFormHelperText-root': {
    marginInline: 0,
    marginTop: theme.spacing(0.5),
  },
}));
const CheckBoxStyled = styled(RHFCheckbox)(({ theme }) => ({
  '& .MuiButtonBase-root': { padding: 0, marginRight: theme.spacing(1) },
  [`&.${formControlLabelClasses.root}`]: { alignItems: 'flex-start' },
}));
const ToggleButtonGroupStyle = styled(ToggleButtonGroup)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: 448,
  [theme.breakpoints.down('md')]: { width: 360 },
  padding: 0,
  border: 'unset !important',
  '& .MuiToggleButtonGroup-grouped': {
    border: '1px solid  !important',
    borderRadius: `${theme.spacing(1)} !important`,
    borderColor: `${theme.palette.grey[300]} !important`,
    color: theme.palette.text.primary,
  },
  '& .Mui-selected': {
    borderColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.common.white} !important`,
    backgroundColor: `${theme.palette.primary.main} !important`,
  },
}));
const ToggleButtonStyle = styled(ToggleButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  cursor: 'pointer',
  border: '1px solid !important',
  width: 80,
  [theme.breakpoints.down('md')]: { width: 56 },
  height: 32,
  paddingInline: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  marginTop: 0,
  borderRadius: theme.spacing(1),
}));
/* #endregion */

const DonatePaymentForm = () => {
  const [openTermsConditions, setOpenTermsConditions] = useState<boolean>(false);
  const [donationAmount, setDonationAmount] = useState<number>();

  /* #region  RHF&YUP */
  const PaymentValidationSchema = Yup.object().shape({
    desiredAmount: Yup.number()
      .typeError('The inserted value is not correct')
      .min(2.0)
      .max(!donationAmount ? 100.0 : donationAmount)
      .test('valid dollar', 'The inserted value is not correct', (value) => /^\d*.?\d{0,2}$/.test(value as any))
      .required('The inserted value is Required'),
    tipAmount: Yup.number()
      .typeError('The inserted value is not correct')
      .min(2.0)
      .max(!donationAmount ? 100.0 : donationAmount)
      .test('valid dollar', 'The inserted value is not correct', (value) => /^\d*.?\d{0,2}$/.test(value as any)),
  });

  const methods = useForm<PaymentDataType>({
    mode: 'onChange',
    resolver: yupResolver(PaymentValidationSchema),
  });

  const {
    watch,
    formState: { errors },
  } = methods;
  /* #endregion */

  return (
    <>
      <Stack spacing={2} maxWidth={448}>
        {
          /* #region Donation Summary Box */
          <Stack spacing={2} justifyContent="flex-start">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar variant="rounded" />
              <Typography variant="subtitle2" color="text.primary">
                Global Giving
              </Typography>
            </Box>
            <Box>
              <DonateSummaryBox />
            </Box>
          </Stack>
          /* #endregion */
        }
        <Box style={{ marginInline: isMobile ? -16 : -24 }}>
          <Divider />
        </Box>
        <FormProvider
          methods={methods}
          // onSubmit={handleSubmit()}
        >
          <Stack spacing={3} justifyContent="flex-start">
            <Typography variant="subtitle2" color="text.primary">
              Donation amount
            </Typography>
            <Box>
              <ToggleButtonGroupStyle color="primary" value={donationAmount} exclusive>
                {donationAmountArrays.map((item) => (
                  <ToggleButtonStyle
                    value={+item.slice(1)}
                    onClick={() => {
                      setDonationAmount(+item.slice(1));
                      // setValue('desiredAmount', '$' + `${+item.slice(1)}`);
                    }}
                  >
                    {item}
                  </ToggleButtonStyle>
                ))}
              </ToggleButtonGroupStyle>
            </Box>
            <Stack spacing={3}>
              <Box>
                <TextFieldStyled
                  name="desiredAmount"
                  variant="outlined"
                  label={watch('desiredAmount') ? 'Your Desired Amount' : ''}
                  placeholder={!!donationAmount ? `$${donationAmount}` : 'Insert Your Desired Amount'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="dollar-coin" color="grey.300" />
                      </InputAdornment>
                    ),
                    endAdornment: !!errors.desiredAmount?.message && (
                      <InputAdornment position="end">
                        <Icon name="Exclamation-Mark-1" type="solid" color="error.main" />
                      </InputAdornment>
                    ),
                    sx: {
                      input: {
                        '&::placeholder': {
                          color: 'text.secondary',
                          fontWeight: 300,
                          fontSize: 14,
                          lineHeight: 17.5,
                        },
                      },
                    },
                  }}
                />
              </Box>
              <Box>
                <TextFieldStyled
                  name="tipAmount"
                  variant="outlined"
                  label={watch('tipAmount') ? 'Garden of Love Tip' : ''}
                  placeholder="Garden of Love Tip (optional)"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="dollar-coin" color="grey.300" />
                      </InputAdornment>
                    ),
                    endAdornment: !!errors.desiredAmount?.message && (
                      <InputAdornment position="end">
                        <Icon name="Exclamation-Mark-1" type="solid" color="error.main" />
                      </InputAdornment>
                    ),
                    sx: {
                      input: {
                        '&::placeholder': {
                          color: 'text.secondary',
                          fontWeight: 300,
                          fontSize: 14,
                          lineHeight: 17.5,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Stack>
            <Stack>
              <FormControlLabel
                value="end"
                control={<Checkbox />}
                label={
                  <Typography variant="body2" color="grey.900">
                    Donate Anonymously
                  </Typography>
                }
              />
              <Typography variant="body2" color="grey.700" pl={4}>
                By Donating Anonymously, your donated amount will be added to the campaign's total donations, also you
                can see it as your donation history. Only the NGO user cannot see your identity information.
              </Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography variant="subtitle1" color="grey.900">
                Checkout Summary
              </Typography>
              <Box sx={{ border: '1px solid', borderRadius: 1, borderColor: 'grey.300', py: 1 }}>
                {
                  /* #region Calculate Donation */
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
                      <Typography variant="body2" color="grey.900">
                        Donation amount
                      </Typography>
                      <Typography variant="body2" color="grey.500">
                        $140
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
                      <Typography variant="body2" color="grey.900">
                        Garden of Love Tip
                      </Typography>
                      <Typography variant="body2" color="grey.500">
                        $1,32
                      </Typography>
                    </Box>
                    <Divider />
                  </Box>
                  /* #endregion */
                }
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1 }}>
                  <Typography variant="subtitle2" color="grey.900">
                    Total
                  </Typography>
                  <Typography variant="subtitle2" color="text.primary">
                    $141,32
                  </Typography>
                </Box>
              </Box>
              <CheckBoxStyled
                name="termsAndConditions"
                label={
                  <Typography variant="body2" color="info.main">
                    I Have Read and Accepted the Privacy & Policy Terms and Conditions
                  </Typography>
                }
                onClick={(e: any) => {
                  e.target.checked && setOpenTermsConditions(true);
                }}
              />
              <Button variant="contained" color="primary" sx={{ width: '100%' }}>
                Pay $30,12
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      </Stack>

      {openTermsConditions && <TermAndConditions />}
    </>
  );
};

export default DonatePaymentForm;
