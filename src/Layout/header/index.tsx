import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import {
  AppBar,
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAddKeyWordMutation } from 'src/_graphql/search/mutations/addKeyWord.generated';
import { useRemoveKeyWordMutation } from 'src/_graphql/search/mutations/removeKeyWord.generated';
// import Clock from 'src/assets/icons/search/clock.svg';
// import Close from 'src/assets/icons/search/close.svg';
import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';
import Logo from 'src/components/Logo';
import { HEADER, SIZES } from 'src/config';
import useOffSetTop from 'src/hooks/useOffSetTop';
import { PATH_APP } from 'src/routes/paths';
import { useDispatch, useSelector } from 'src/store';
import {
  ISearchedKeyWord,
  addKeyWord,
  getSearchedLastKeyWords,
  getSearchedValues,
  removeKeyWord,
  setSearchedText,
} from 'src/store/slices/search';
// utils
import cssStyles from 'src/utils/cssStyles';

import AccountPopover from './AccountPopover';
import MoneyPopover from './MoneyPopover';

type RootStyleProps = {
  isCollapse: boolean;
  isOffset: boolean;
  verticalLayout: boolean;
};

interface IIconWrapper {
  active?: boolean;
}

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})<RootStyleProps>(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  backgroundColor: '#ffffff ',
  width: '100%',
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    // width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    // ...(isCollapse && {
    //   width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    // }),
    // ...(isOffset && {
    //   height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    // }),
    // ...(verticalLayout && {
    //   width: '100%',
    //   height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    //   backgroundColor: theme.palette.background.default,
    // }),
  },
}));

const IconWrapper = styled(Stack, { shouldForwardProp: (prop) => prop !== '' })<IIconWrapper>(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  height: 'fit-content',
}));
const SearchSuggestion = styled(Box)<{ show: boolean }>(({ theme, show }) => ({
  display: show ? 'block' : 'none',
  width: '100%',
  height: 'auto',
  backgroundColor: theme.palette.background.paper,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: theme.spacing(1.2),
  position: 'absolute',
  top: -4,
  left: 0,
  zIndex: 10,
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(0.25),
}));
const KeywordItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  borderRadius: theme.spacing(1.2),
  display: 'flex',
  gap: 8,
  padding: theme.spacing(0.5, 1),
  width: 'max-content',
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));
// const RecentlyItem = styled(Box)(({ theme }) => ({
//   marginBottom: theme.spacing(2),
//   display: 'flex',
//   justifyContent: 'space-between',
// }));
const TextFieldSearch = styled(TextField)(({ theme }) => ({
  zIndex: 99,
  width: '100%',
  backgroundColor: theme.palette.grey[0],
}));
const ContentSearchSuggestion = styled(Stack)(({ theme }) => ({
  height: 'auto',
  overflowX: 'auto',
  scrollbarColor: `${theme.palette.grey[300]} ${theme.palette.grey[0]}`,
  scrollbarWidth: 'auto',
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

const LogoStyle = styled(Box)(() => ({
  cursor: 'pointer',
}));

const ClickableStyle = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
}));

// ----------------------------------------------------------------------

type Props = {
  isCollapse?: boolean;
  verticalLayout?: boolean;
};

export default function Header({ isCollapse = false, verticalLayout = false }: Props) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;
  const dispatch = useDispatch();
  const [searchedValueText, setSearchedValueText] = useState<string>('');
  const searchedValue = useSelector(getSearchedValues);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [addKeyWordMutation] = useAddKeyWordMutation();
  const [removeKeyWordMutation] = useRemoveKeyWordMutation();
  const keyWords = useSelector(getSearchedLastKeyWords);
  const [showSearchHelper, setShowSearchHelper] = useState<boolean>(false);
  const searchInputId = 'header-search';
  const handleSearchedText = (keyword?: string) => {
    const value = keyword || searchedValueText;
    setShowSearchHelper(false);
    if (pathname !== '/search/[[...index]]') {
      navigate(PATH_APP.search.all);
    }
    dispatch(setSearchedText(value));
    if (searchedValueText)
      addKeyWordMutation({ keyWord: { dto: { keyword: value } } })
        .unwrap()
        .then((res) => {
          if (res?.keywordCommandHandler?.listDto?.items) {
            if (keyWords.find((i) => i!.keyword!.trim() === value.trim())) {
              return;
            }
            dispatch(addKeyWord(res!.keywordCommandHandler!.listDto!.items[0]!));
          }
        })
        .catch((err) => {});
  };

  const removeKeyWordHandler = (keyWord: ISearchedKeyWord) => {
    dispatch(removeKeyWord(keyWord!.id!));
    removeKeyWordMutation({ filter: { dto: { id: keyWord.id } } })
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        dispatch(addKeyWord(keyWord));
      });
  };

  useEffect(() => {
    setSearchedValueText(searchedValue.searchedText);
  }, [searchedValue.searchedText]);

  useEffect(() => {
    if (pathname !== '/search/[[...index]]') {
      dispatch(setSearchedText(''));
    }
  }, [dispatch, pathname]);

  // useEffect(() => {
  //   getLastKeyWordQuery({ filter: { pageIndex: 0, pageSize: 5 } })
  //     .unwrap()
  //     .then((res) => {
  //       if (res?.lastKeywordQueryHandler?.listDto?.items) {
  //         dispatch(valuingAllSearchedKeyWord(res!.lastKeywordQueryHandler!.listDto!.items as ISearchedKeyWord[]));
  //       }
  //     })
  //     .catch((err) => {});
  // }, []);

  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          paddingRight: '0!important',
          paddingLeft: '0!important',
          maxWidth: SIZES.lg,
          width: '100%',
          margin: '0 auto',
          // minWidth: SIZES.lg,
        }}
      >
        <Stack sx={{ width: '100%' }} direction="row" justifyContent="space-between">
          <Stack alignItems="center" direction="row" spacing={2}>
            <Link to="/home">
              <LogoStyle id="header-logo">
                <Logo />
              </LogoStyle>
            </Link>
            <Box
              component="div"
              tabIndex={-1}
              sx={{
                width: 348,
                position: 'relative',
                px: 0.5,
              }}
            >
              <TextFieldSearch
                size="small"
                id={searchInputId}
                placeholder="Search"
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton onClick={() => handleSearchedText()}>
                        <Icon name="Research" type="solid" color="grey.500" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onClick={(e) => {
                  setShowSearchHelper(true);
                }}
                value={searchedValueText}
                onChange={(e) => setSearchedValueText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchedText();
                  }
                }}
              />
              <ClickAwayListener
                onClickAway={(e: any) => {
                  const id = e.target.getAttribute('id');
                  if (showSearchHelper && id !== searchInputId) {
                    setShowSearchHelper(false);
                  }
                }}
              >
                <SearchSuggestion show={showSearchHelper} className="SearchSuggestionBox">
                  <ContentSearchSuggestion pt={1} pb={2} px={2}>
                    {keyWords.length > 0 && (
                      <Typography variant="subtitle2" color="text.secondary" mb={2}>
                        Keywords
                      </Typography>
                    )}

                    <Stack direction="row" flexWrap="wrap">
                      {keyWords.map((keyWord) => (
                        <KeywordItem key={keyWord.id}>
                          <ClickableStyle
                            onClick={() => {
                              setSearchedText(keyWord!.keyword!);
                              handleSearchedText(keyWord!.keyword!);
                            }}
                          >
                            <Image src={'src/assets/icons/search/clock.svg'} alt="clock" />
                          </ClickableStyle>
                          <ClickableStyle
                            onClick={() => {
                              setSearchedText(keyWord!.keyword!);
                              handleSearchedText(keyWord!.keyword!);
                            }}
                          >
                            <Typography variant="body2" color="text.primary" sx={{ cursor: 'pointer' }}>
                              {keyWord.keyword}
                            </Typography>
                          </ClickableStyle>

                          <IconButton
                            onClick={() => {
                              removeKeyWordHandler(keyWord);
                            }}
                          >
                            <Image src={'src/assets/icons/search/close.svg'} alt="close" />
                          </IconButton>
                        </KeywordItem>
                      ))}
                    </Stack>
                  </ContentSearchSuggestion>
                </SearchSuggestion>
              </ClickAwayListener>
            </Box>
          </Stack>

          <Stack alignItems="center" spacing={4} direction="row">
            <Link to="/">
              <IconWrapper justifyContent="center" active id="header-house">
                {/* <img alt="header-house" src="src/assets/icons/Home/24/Outline.svg" width={SIZES.icon} height={SIZES.icon} /> */}
                <Icon name="Home" color="grey.0" type="solid" />
              </IconWrapper>
            </Link>
            <Link to="connections/followers">
              <IconWrapper justifyContent="center" id="header-users">
                <Icon name="public" type="linear" color="grey.500" />
              </IconWrapper>
            </Link>
            <Link to="notification">
              <IconWrapper justifyContent="center" id="header-notification">
                <Icon name="Bell" type="linear" color="grey.500" />
              </IconWrapper>
            </Link>
            <Link to="chat">
              <IconWrapper justifyContent="center" id="header-messanger">
                <Icon name="chat" type="linear" color="grey.500" />
              </IconWrapper>
            </Link>
          </Stack>

          <Stack direction="row">
            <MoneyPopover />
            <AccountPopover />
          </Stack>
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
