import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Icon,
  IconButton,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material';

import { ArrowLeft } from 'iconsax-react';
import useAuth from 'src/hooks/useAuth';
import useConnection from 'src/hooks/useConnection';
import { useDispatch } from 'src/store';
import { onResetConnections } from 'src/store/slices/connection/connections';
import { AccountPrivacyEnum, FilterByEnum } from 'src/types/serverTypes';

import FilterRadio from './FilterRadio';
import ConnectionContent from './listContent/ConnectionContent';
import SearchField from './searchField/SearchField';

// type Props = {
//   // children: ReactNode;
//   variant?: 'follower' | 'following' | 'requests' | 'requested';
// };
const FilterIcon = (
  <Icon>
    <img alt="" src="/icons/filters.svg" />
  </Icon>
);
const ConnectionModesStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  width: '100%',
  gap: 3,
  zIndex: 2,
}));
const connectionsType = ['followers', 'followings', 'requests', 'requested'];
const ConnectionLayout = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [filterBy, setFilterBy] = useState<FilterByEnum>(FilterByEnum.All);
  const [debounced, setDebounced] = useState<string>('');

  const navigate = useNavigate();
  const { type, userId } = useParams();

  useConnection(type! as string, debounced, filterBy, userId, pageIndex);

  return (
    <>
      <Container sx={{ padding: 0 }}>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" justifyContent="center" spacing={2}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <ArrowLeft color={theme.palette.text.primary} />
            </IconButton>
            <Typography variant="subtitle1">Connections</Typography>
          </Stack>
        </Stack>
        <Divider />
        <ConnectionModesStyled>
          <Container>
            <Stack spacing={3} direction="row">
              {connectionsType
                .filter((i, ind) => {
                  if (userId && ind > 1) {
                    return false;
                  } else if (user?.accountPrivacy === AccountPrivacyEnum.Public && ind === 2) {
                    return false;
                  }
                  return true;
                })
                .map((item, index) => (
                  <Button
                    key={index}
                    variant="text"
                    onClick={() => {
                      navigate(`${item}${userId ? `/?userId=${userId}` : ''}`);
                      setPageIndex(1);
                      dispatch(onResetConnections());
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        borderBottom: `2px solid ${type === item ? theme.palette.primary.main : 'initial'}`,
                        color: type === item ? theme.palette.primary.main : 'text.secondary',
                      }}
                    >
                      {item}
                    </Typography>
                  </Button>
                ))}
            </Stack>
          </Container>
        </ConnectionModesStyled>
        <SearchField pageIndex={pageIndex} setPageIndex={setPageIndex} setDebounced={setDebounced} />
        <Divider />
        <Box sx={{ mb: 2, px: 2, pt: 3, justifyContent: 'flex-start' }}>
          <Button
            onClick={() => setShowModal(true)}
            variant="text"
            size="large"
            endIcon={FilterIcon}
            sx={{
              backgroundColor: theme.palette.background.neutral,
              color: theme.palette.text.primary,
            }}
          >
            <Badge color="error" variant="dot" invisible={filterBy === FilterByEnum.All}>
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
                Filters
              </Typography>
            </Badge>

            {filterBy !== FilterByEnum.All && (
              <Chip
                label={filterBy}
                variant="outlined"
                sx={{
                  backgroundColor: theme.palette.surface.main,
                  marginLeft: theme.spacing(1),
                  borderRadius: theme.spacing(1),
                }}
                onDelete={() => setFilterBy(FilterByEnum.All)}
                deleteIcon={<CloseRoundedIcon />}
                size="small"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </Button>
        </Box>
        <Divider />
        <Container sx={{ p: '0px !important' }}>
          <Stack spacing={3} direction="row">
            <Stack spacing={3}>
              <ConnectionContent setPageIndex={setPageIndex} />
            </Stack>
          </Stack>
        </Container>
      </Container>
      <BottomSheet
        open={showModal}
        onDismiss={() => setShowModal(false)}
        snapPoints={({ minHeight, maxHeight }) => [maxHeight, minHeight, maxHeight]}
      >
        <FilterRadio setPageIndex={setPageIndex} filterBy={filterBy} setFilterBy={setFilterBy} />
      </BottomSheet>
    </>
  );
};

export default ConnectionLayout;
