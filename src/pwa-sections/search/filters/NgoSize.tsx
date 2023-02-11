import { FC, useEffect } from 'react';

import { CircularProgress, FormControl, FormControlLabel, Radio, RadioGroup, Stack } from '@mui/material';

import { useLazyGetNumberRangeQuery } from 'src/_graphql/profile/ngoPublicDetails/queries/getNumberRange.generated';

interface INgoSortProps {
  ngoSize: string[];
  sizeChanged: (size: string[]) => void;
}

const NgoSize: FC<INgoSortProps> = ({ ngoSize, sizeChanged }) => {
  const [getRange, { data, isFetching }] = useLazyGetNumberRangeQuery();
  useEffect(() => {
    getRange({ filter: { dto: {} } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isFetching && (
        <FormControl>
          <RadioGroup
            defaultValue={ngoSize[0] || ''}
            value={ngoSize[0] || ''}
            onChange={(e) => {
              sizeChanged([e.target.value!]);
            }}
            name="ngo-sort"
          >
            {data?.getNumberRanges?.listDto?.items?.map((size) => (
              <FormControlLabel
                key={size?.id}
                sx={{ marginBottom: 1 }}
                value={size?.id}
                control={<Radio />}
                label={size?.to ? `from ${size?.from} to ${size?.to}` : `from ${size?.from}`}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
      {isFetching && (
        <Stack alignItems="center" justifyContent="center">
          <CircularProgress />
        </Stack>
      )}
    </>
  );
};

export default NgoSize;
