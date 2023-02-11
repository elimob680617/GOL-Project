import { useEffect, useState } from 'react';

import { SearchRounded } from '@mui/icons-material';
import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useLazyConversationContactsQuery } from 'src/_graphql/chat/queries/conversationContact.generated';
import { Icon } from 'src/components/Icon';
import LoadingCircular from 'src/sections/connections/listContent/LoadingCircular';

import OneUser from './OneUser';

const ConnectionsList = () => {
  const [connections, setConnections] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [debounced, setDebounced] = useState<string>('');
  const [conversationContacts, { data, isFetching }] = useLazyConversationContactsQuery();
  useEffect(() => {
    const searchDelay = setTimeout(() => {
      setDebounced(searchText);
    }, 500);

    return () => clearTimeout(searchDelay);
  }, [searchText]);

  useEffect(() => {
    conversationContacts({ filter: { dto: { text: debounced } } });
  }, [conversationContacts, debounced]);

  useEffect(() => {
    if (data) {
      setConnections(data.conversationContacts?.listDto?.items ?? []);
    }
  }, [data]);
  console.log(connections);

  return (
    <Stack spacing={3} sx={{ height: '100%', pt: 2 }}>
      <Box display="flex" justifyContent={'space-between'}>
        <Typography variant="h4">Chats</Typography>
        <Typography variant="h4" sx={{ cursor: 'pointer' }}>
          <Icon name="Edit" />
        </Typography>
      </Box>
      <TextField
        sx={{ width: '100%', alignSelf: 'center' }}
        id="search-user"
        label="Search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchRounded />
            </InputAdornment>
          ),
        }}
        variant="outlined"
      />
      <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
        {isFetching && <LoadingCircular />}
        {connections.map((item, index) => (
          <OneUser key={index} checkActive={index} id={index} user={item} />
        ))}
      </Box>
    </Stack>
  );
};

export default ConnectionsList;
