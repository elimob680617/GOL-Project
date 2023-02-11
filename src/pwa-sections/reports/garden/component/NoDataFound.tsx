import { Stack } from '@mui/material';

function NoDataFound() {
  return (
    <Stack width="100%" alignItems="center" justifyContent="center" mt="25%" mb="25%">
      <img src="/src/assets/images/notfound/noDonors.svg" alt="NoDataFound" width={200} loading="lazy" />
    </Stack>
  );
}

export default NoDataFound;
