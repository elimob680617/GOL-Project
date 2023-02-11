import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { More } from 'iconsax-react';
import useAuth from 'src/hooks/useAuth';
import useOnScreen from 'src/hooks/useIsVisiable';
import { useSelector } from 'src/store';
import { FilterByEnum, StatusEnum } from 'src/types/serverTypes';

import AvatarChecker from './AvatarChecker';
import ButtonChecker from './ButtonChecker';
import EmptyState from './EmptyState';
import LoadingCircular from './LoadingCircular';
import PopOverChecker from './PopOverChecker';

const ConnectionContent: FC<{ setPageIndex: React.Dispatch<React.SetStateAction<number>> }> = ({ setPageIndex }) => {
  const theme = useTheme();
  const auth = useAuth();
  const { user } = auth;
  const { connections, loading } = useSelector((state) => state.connectionsList);
  const ref = useRef<HTMLDivElement>(null);
  const onScreen: boolean = useOnScreen<any>(ref, ref.current ? `-${ref.current.offsetHeight}px` : '');
  const { type, userId } = useParams();
  const navigation = useNavigate();
  useEffect(() => {
    if (onScreen && connections.length) {
      setPageIndex(Math.floor(connections.length / 10) + 1);
    }
  }, [connections.length, onScreen, setPageIndex]);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [meToOther, setMeToOther] = useState<StatusEnum>();
  const [itemId, setItemId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [itemType, setItemType] = useState<FilterByEnum>();
  const [index, setIndex] = useState<number>(0);

  return (
    <Box
      sx={{
        backgroundColor: ({ palette }) => palette.background.paper,
        borderRadius: 1,
        minHeight: '308px',
        width: 840,
        height: '70vh',
        overflow: 'auto',
      }}
      px={3}
    >
      <Typography variant="subtitle2" color="text.secondary" my={2}>
        {connections.length} {type}
      </Typography>

      {loading ? (
        <LoadingCircular />
      ) : !connections.length ? (
        <EmptyState />
      ) : (
        <Stack>
          {connections.map((item, ind) => (
            <Fragment key={ind}>
              <Divider />
              <Stack direction="row" my={2} sx={{ justifyContent: 'space-between' }}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ justifyContent: 'flex-start', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => {
                    if (item?.itemType === FilterByEnum.Normal) navigation(`/profile/user/view/${item.itemId}`);
                    else if (item?.itemType === FilterByEnum.Ngo) navigation(`/profile/ngo/view/${item.itemId}`);
                  }}
                >
                  <AvatarChecker
                    userType={item.itemType!}
                    fullName={item.fullName ? item.fullName! : item.firstName!}
                    avatarUrl={item.avatarUrl || ''}
                  />
                  <Box>
                    <Typography variant="subtitle2" color="text.primary">
                      {item.fullName ? item.fullName : `${item.firstName} ${item.lastName}`}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.headline
                        ? item.headline?.length > 30
                          ? `${item.headline.slice(0, 30)}...`
                          : item.headline
                        : ''}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                  {user?.id !== item.itemId && (
                    <>
                      <ButtonChecker
                        meToOther={item.meToOtherStatus!}
                        otherToMe={item.otherToMeStatus!}
                        itemId={item.itemId!}
                        itemType={item.itemType!}
                        url={type!}
                        index={ind}
                        fullName={item.fullName!}
                      />
                      {type !== 'requests' && !userId && (
                        <IconButton
                          color="secondary"
                          aria-describedby="3dotpopup"
                          onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            setAnchorEl(event.currentTarget);
                            setMeToOther(item.meToOtherStatus!);
                            setItemId(item.itemId);
                            setItemType(item.itemType!);
                            setIndex(ind);
                            setFullName(item.fullName!);
                          }}
                        >
                          <More color={theme.palette.grey[500]} />
                        </IconButton>
                      )}
                    </>
                  )}
                </Stack>
              </Stack>
            </Fragment>
          ))}
        </Stack>
      )}
      <div ref={ref} />
      <PopOverChecker
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        itemType={itemType}
        itemId={itemId}
        meToOther={meToOther}
        url={type}
        index={index}
        fullName={fullName}
      />
    </Box>
  );
};

export default ConnectionContent;
