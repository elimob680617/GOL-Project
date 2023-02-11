// import { useState, useEffect } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { Box, Paper, Stack, Typography } from '@mui/material';

import { useGetByRoomIdConversationContactQuery } from 'src/_graphql/chat/queries/getByRoomIdConversationContact.generated';
import { useMessagesByRoomIdQuery } from 'src/_graphql/chat/queries/messagesByRoomId.generated';
import useOnScreen from 'src/hooks/useIsVisiable';
import LoadingCircular from 'src/sections/connections/listContent/LoadingCircular';
import { useDispatch, useSelector } from 'src/store';
import { onGetAllMsg, onPaginateMsg, onUpdateMsg } from 'src/store/slices/chat/allMsgReducer';
import { onSelectUser } from 'src/store/slices/chat/selectedUser';
import { ConversationContactResponseDto, MessageResponseDto } from 'src/types/serverTypes';

import ChatHeader from './ChatHeader';
import ChatList from './ChatList';
import MsgInput from './MsgInput';
import UserAvatarName from './UserAvatarName';

const ChatBox = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const { allMsgState: allMsg } = useSelector((state) => state.allMsg);
  const { onChatUser } = useSelector((state) => state.selectedUser);
  const { id } = useParams();
  const pageRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>();
  const onScreen: boolean = useOnScreen<HTMLDivElement>(
    pageRef as any,
    pageRef.current ? `-${pageRef.current.offsetHeight}px` : '',
  );
  const { data, isLoading, isFetching } = useMessagesByRoomIdQuery({
    filter: { pageIndex: page, dto: { roomId: id?.[0] } },
  });
  const { data: contactData } = useGetByRoomIdConversationContactQuery({
    filter: { dto: { roomId: id?.[0] } },
  });

  useEffect(() => {
    if (onScreen && allMsg.length && !isFetching && boxRef.current) {
      boxRef.current.scrollTop += 80;
      if (allMsg.length < count) setPage((p) => p + 1);
    }
  }, [allMsg.length, count, isFetching, onScreen]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (page === 1) scrollToBottom();
  }, [page]);

  useEffect(() => {
    if (contactData) {
      dispatch(
        onSelectUser(contactData.getByRoomIdConversationContact?.listDto?.items?.[0] as ConversationContactResponseDto),
      );
    }
  }, [contactData, dispatch]);
  useEffect(() => {
    if (data && !isFetching) {
      if (!page) {
        dispatch(onGetAllMsg(data.messagesByRoomId?.listDto?.items as MessageResponseDto[]));
      } else {
        console.log(boxRef?.current?.scrollTop);

        dispatch(onPaginateMsg(data.messagesByRoomId?.listDto?.items as MessageResponseDto[]));
      }
      setCount(data.messagesByRoomId?.listDto?.count);
    }
  }, [data, dispatch, isFetching, page]);

  const room = id![0];
  const accessToken = window.localStorage.getItem('accessToken');
  const socketUrl = `wss://f3ojsp2tsc.execute-api.us-east-1.amazonaws.com/dev?token=${accessToken}&room_id=${room}`;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
    onMessage: (e) => console.log(e),
  });
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  console.log(connectionStatus);

  useEffect(() => {
    if (lastJsonMessage && (lastJsonMessage as any).text_content) {
      const newMessage: MessageResponseDto = {
        id: (lastJsonMessage as any).id,
        mine: onChatUser.userId === (lastJsonMessage as any).user_id,
        roomId: (lastJsonMessage as any).room_id,
        text: (lastJsonMessage as any).text_content,
        toUserId: (lastJsonMessage as any).user_id,
        toUserName: (lastJsonMessage as any).username,
        ulId: (lastJsonMessage as any).guid,
        createdDateTime: new Date((lastJsonMessage as any).created_at * 1000),
      };
      dispatch(onUpdateMsg(newMessage));
      scrollToBottom();
    }
  }, [lastJsonMessage, dispatch, onChatUser.userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  };

  return (
    <Stack sx={{ height: '100%' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflowY: 'auto',
        }}
      >
        {allMsg.length ? <ChatHeader /> : null}
        <Box sx={{ height: '70vh', overflowY: 'auto' }} ref={boxRef}>
          <div ref={pageRef} />
          {!isLoading && isFetching && <LoadingCircular />}
          {isLoading ? (
            <LoadingCircular />
          ) : allMsg.length ? (
            <>
              {allMsg
                .map((item: any, index: number, arr: any) => (
                  <ChatList key={index} chat={item} list={arr} index={index} />
                ))
                .reverse()}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <>
              <UserAvatarName />
              <Stack
                sx={{
                  width: '164px',
                  height: '164px',
                  backgroundColor: (theme) => theme.palette.grey[100],
                  borderRadius: '50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  margin: '15vh 0',
                  marginLeft: 'calc(50% - 82px)',
                }}
              >
                <Typography>No Message</Typography>
              </Stack>
            </>
          )}
        </Box>
        <MsgInput sendJsonMessage={sendJsonMessage} room={room} />
      </Paper>
    </Stack>
  );
};

export default ChatBox;
