import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import {
  Box,
  Dialog,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';

import { useGetNumberRangeQuery } from 'src/_graphql/profile/ngoPublicDetails/queries/getNumberRange.generated';
import { Icon } from 'src/components/Icon';
import Loading from 'src/components/Loading';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import { ngoSizeSelector, ngoSizeUpdated } from 'src/store/slices/profile/ngoPublicDetails-slice';

import NgoPublicDetailsMessages from '../NgoPublicDetails.messages';

export default function SizeStatusDialog() {
  const { data: sizeNGO, isFetching } = useGetNumberRangeQuery({
    filter: {
      all: true,
    },
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ngoSize = useSelector(ngoSizeSelector);

  const [index, setIndex] = useState<string | null>(null);

  useEffect(() => {
    if (index !== null) {
      dispatch(
        ngoSizeUpdated({
          ...ngoSize,
          id: sizeNGO?.getNumberRanges?.listDto?.items?.[Number(index)]?.id,
          desc: sizeNGO?.getNumberRanges?.listDto?.items?.[Number(index)]?.desc || undefined,
          isChange: true,
        }),
      );
      navigate(-1);
    }
  }, [dispatch, index, navigate, ngoSize, sizeNGO?.getNumberRanges?.listDto?.items]);

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NgoPublicDetailsMessages.ngoSizeTitle} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.ngo.publicDetails.ngoSize.root}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {isFetching ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Loading />
            </Box>
          ) : (
            <RadioGroup
              onChange={(e) => {
                setIndex(e.target.value);
              }}
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
            >
              {sizeNGO?.getNumberRanges?.listDto?.items?.map((_size, i: number) => (
                <>
                  <FormControlLabel
                    checked={ngoSize?.id === _size?.id}
                    key={_size?.id}
                    value={i}
                    control={<Radio />}
                    label={_size?.desc || ''}
                  />
                </>
              ))}
            </RadioGroup>
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}
