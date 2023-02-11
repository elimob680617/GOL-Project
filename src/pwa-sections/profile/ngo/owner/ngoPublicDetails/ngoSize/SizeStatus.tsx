import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  CircularProgress,
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

import NgoPublicDetailsMessages from '../NgoPublicDetailsPwa.messages';

interface SelectNgoSizeType {
  onChange: (value: { id?: string; desc?: string }) => void;
  sizeId?: string;
}

export default function SizeStatusDialog(props: SelectNgoSizeType) {
  const { onChange, sizeId } = props;
  const navigate = useNavigate();

  const { data: sizeNGO, isFetching } = useGetNumberRangeQuery({
    filter: {
      all: true,
    },
  });

  const handleChange = (val: any) => {
    onChange({
      id: sizeNGO?.getNumberRanges?.listDto?.items?.[val]?.id,
      desc: sizeNGO?.getNumberRanges?.listDto?.items?.[val]?.desc as string,
    });
  };

  return (
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
      </Stack>
      <Divider />
      <Stack spacing={2} sx={{ px: 2 }}>
        {isFetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <RadioGroup
            onChange={(e) => {
              handleChange((e.target as HTMLInputElement).value);
            }}
            // value={sizeId}
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
          >
            {sizeNGO?.getNumberRanges?.listDto?.items?.map((_size, i: number) => (
              <>
                <FormControlLabel
                  key={_size?.id}
                  value={i}
                  control={<Radio />}
                  label={_size?.desc}
                  checked={sizeId === _size?.id}
                />
              </>
            ))}
          </RadioGroup>
        )}
      </Stack>
    </Stack>
  );
}
