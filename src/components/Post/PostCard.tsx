import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const RootStyle = styled(Stack)(({ theme }) => ({
  paddingTop: 1,
  backgroundColor: theme.palette.surface.main,
  borderRadius: theme.shape.borderRadius,
}));

function PostCard({ children }: any) {
  return <RootStyle sx={{ paddingTop: 2, backgroundColor: 'surface.main' }}>{children}</RootStyle>;
}

export default PostCard;
