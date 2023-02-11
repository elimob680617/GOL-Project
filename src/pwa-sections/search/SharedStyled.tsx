import { Badge, Box, Stack, Typography, styled } from '@mui/material';

export const SearchBadgeStyle = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    minWidth: 'unset!important',
    width: '6px!important',
    height: '6px!important',
    right: '-4px!important',
  },
}));

export const StackStyle = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const ImageStyle = styled('img')(({ theme }) => ({
  width: 24,
  height: 24,
}));

export const SearchWrapperStyle = styled(Stack)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
}));

export const ElipsesText = styled(Typography)<{ hasOverflow?: boolean }>(({ theme, hasOverflow }) => ({
  position: 'relative',
  ...(hasOverflow && {
    '&:focus, &:hover': {
      overflow: 'visible',
      color: 'transparent',

      '&:after': {
        content: 'attr(data-text)',
        overflow: 'visible',
        textOverflow: 'inherit',
        position: 'absolute',
        left: '0',
        top: '0',
        // whiteSpace: 'normal',
        // wordWrap: 'break-word',
        // display: 'block',
        zIndex: 2,
        color: theme.palette.text.primary,
        // maxWidth: 'min-content',
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0px 2px 4px 0px rgba(0,0,0,.28)',
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
      },
    },
  }),
}));

export const HorizontalScrollerWithNoScroll = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}));

export const HorizontalScrollerWithScroll = styled(Box)(({ theme }) => ({
  whiteSpace: 'nowrap',
  overflowY: 'auto',
  width: '100%',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '-ms-overflow-style': 'none' /* IE and Edge */,
  'scrollbar-width': 'none',
}));

export const InlineBlockStyle = styled(Box)(({ theme }) => ({
  display: 'inline-block',
}));

export const ClickableText = styled(Typography)(({ theme }) => ({}));
