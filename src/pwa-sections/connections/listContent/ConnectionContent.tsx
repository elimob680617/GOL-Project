import { Dispatch, FC, Fragment, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BottomSheet } from 'react-spring-bottom-sheet';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Divider, IconButton, Stack, Typography, useTheme } from '@mui/material';

import { useUpdateConnectionMutation } from 'src/_graphql/connection/mutations/updateConnection.generated';
import useAuth from 'src/hooks/useAuth';
import useOnScreen from 'src/hooks/useIsVisiable';
import { useDispatch, useSelector } from 'src/store';
import { onChangeStatus } from 'src/store/slices/connection/connections';
import { FilterByEnum, RequestEnum, StatusEnum } from 'src/types/serverTypes';

import AvatarChecker from './AvatarChecker';
import ButtonChecker from './ButtonChecker';
import EmptyState from './EmptyState';
import LoadingCircular from './LoadingCircular';
import PopOverChecker from './PopOverChecker';
import WarningDialog from './WarningDialog';

export type StateType = {
  actionFn?: (actionType: RequestEnum, id?: string) => Promise<void>;
  onClose?: Dispatch<SetStateAction<StateType>>;
  warningText: string;
  actionType?: RequestEnum;
  buttonText: string;
  show?: boolean;
  icon?: ReactNode;
  itemId?: string;
};

const ConnectionContent: FC<{ setPageIndex: React.Dispatch<React.SetStateAction<number>> }> = ({ setPageIndex }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { connections, loading } = useSelector((state) => state.connectionsList);
  const dispatch = useDispatch();
  const [changeStatus, { isLoading: updateLoading }] = useUpdateConnectionMutation();
  const ref = useRef<HTMLDivElement>(null);
  const onScreen: boolean = useOnScreen<any>(ref, ref.current ? `-${ref.current.offsetHeight}px` : '');
  const { type, userId } = useParams();
  const navigation = useNavigate();

  useEffect(() => {
    if (onScreen && connections.length) {
      setPageIndex(Math.floor(connections.length / 10) + 1);
    }
  }, [connections.length, onScreen, setPageIndex]);

  const [bottomSheet, setBottomSheet] = useState<boolean>(false);
  const [modal, setModal] = useState<StateType>({
    warningText: '',
    buttonText: '',
    show: false,
  });

  const [meToOther, setMeToOther] = useState<StatusEnum | null>(null);
  const [itemId, setItemId] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [itemType, setItemType] = useState<FilterByEnum | null>(null);
  const [index, setIndex] = useState<number>(0);

  const handleChangeStatus = async (actionType: RequestEnum, id?: string) => {
    try {
      setModal({
        warningText: '',
        buttonText: '',
        show: false,
      });
      const { data }: any = await changeStatus({
        filter: {
          dto: {
            itemId: id || itemId,
            actionType,
          },
        },
      });
      dispatch(
        onChangeStatus({
          index: index,
          actionType: actionType,
          otherToMe: data?.updateConnection.listDto.items[0]?.otherToMeStatus,
          meToOther: data?.updateConnection.listDto.items[0]?.meToOtherStatus,
        }),
      );
    } catch (error) {}
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: ({ palette }) => palette.background.paper,
          borderRadius: 1,
          minHeight: '308px',
          width: '100vw',
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
                    sx={{ justifyContent: 'flex-start', alignItems: 'center' }}
                    onClick={() => {
                      if (item?.itemType === FilterByEnum.Normal) navigation(`/profile/user/view/${item.itemId}`);
                      else if (item?.itemType === FilterByEnum.Ngo) navigation(`/profile/ngo/view/${item.itemId}`);
                    }}
                  >
                    <AvatarChecker
                      userType={item.itemType!}
                      fullName={item.fullName!}
                      avatarUrl={item.avatarUrl || ''}
                    />
                    <Box>
                      <Typography variant="subtitle2" color="text.primary">
                        {item.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.headline}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                    {user?.id !== item.itemId && (
                      <>
                        <ButtonChecker
                          meToOther={item.meToOtherStatus!}
                          otherToMe={item.otherToMeStatus!}
                          itemId={item.itemId}
                          itemType={item.itemType!}
                          url={type!}
                          index={index}
                          handleChangeStatus={handleChangeStatus}
                          updateLoading={updateLoading}
                          fullName={item.fullName!}
                          setModal={setModal}
                        />
                        {type !== 'requests' && !userId && (
                          <IconButton
                            sx={{ color: theme.palette.grey[500] }}
                            aria-describedby="3dotpopup"
                            onClick={() => {
                              setBottomSheet(true);
                              setMeToOther(item.meToOtherStatus!);
                              setItemId(item.itemId);
                              setItemType(item.itemType!);
                              setIndex(index);
                              setFullName(item.fullName!);
                            }}
                          >
                            <MoreVertIcon />
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
      </Box>
      <BottomSheet
        open={bottomSheet}
        onDismiss={() => setBottomSheet(false)}
        snapPoints={({ minHeight, maxHeight }) => [maxHeight, minHeight, maxHeight]}
      >
        <PopOverChecker
          index={index}
          meToOther={meToOther!}
          itemType={itemType!}
          itemId={itemId}
          url={type!}
          fullName={fullName}
          setModal={setModal}
          dismissModal={setBottomSheet}
        />
      </BottomSheet>
      <BottomSheet
        open={!!modal.show}
        onDismiss={() =>
          setModal({
            warningText: '',
            buttonText: '',
            show: false,
          })
        }
        snapPoints={({ minHeight, maxHeight }) => [maxHeight, minHeight, maxHeight]}
      >
        <WarningDialog
          onClose={setModal}
          warningText={modal.warningText}
          actionFn={handleChangeStatus}
          actionType={modal.actionType}
          buttonText={modal.buttonText}
          icon={modal.icon}
          itemId={modal.itemId}
        />
      </BottomSheet>
    </>
  );
};

export default ConnectionContent;
