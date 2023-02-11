import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactDOMServer from 'react-dom/server';

import { Avatar, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PATH_APP } from 'src/routes/paths';
import { PRIMARY } from 'src/theme/palette';
import { UserTypeEnum } from 'src/types/serverTypes';

type itemCard = {
  id: number;
  useAvatar: string;
  userName: string;
  userType: string;
  action: string;
  time: string;
  status: boolean;
};

interface IFoundRasingCard {
  item: itemCard;
}

const MentionId = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

function FoundRasingCard(props: IFoundRasingCard) {
  const { item } = props;
  const [body, setBody] = useState<string>('');

  const MentionElementCreator = (fullname: string, username: string, id: string) => (
    <MentionId id={id}>
      <a style={{ color: PRIMARY.main }} href={PATH_APP.profile.ngo.root + '/view/' + id}>
        {fullname}
      </a>
    </MentionId>
  );

  const BrElementCreator = () => <br />;

  useEffect(() => {
    if (!item) return;
    let bodyData = item.action;
    const mentions = bodyData?.match(/╣(.*?)╠/g) || [];

    bodyData = bodyData?.replace(/\\n/g, ReactDOMServer.renderToStaticMarkup(BrElementCreator()));

    mentions.forEach((mention) => {
      const mentionedValue = mention.replace('╣', '').replace('╠', '');
      bodyData = bodyData?.replace(
        mention,
        ReactDOMServer.renderToStaticMarkup(MentionElementCreator(mentionedValue, mentionedValue, mentionedValue)),
      );
    });

    if (bodyData) setBody(bodyData);
  }, [item]);

  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        borderRadius: '8px',
        bgcolor: item.status ? (theme) => theme.palette.grey[100] : null,
      }}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      flexWrap={'wrap'}
    >
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Avatar src={item.useAvatar} variant={item?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'} />
        <Box sx={{ ml: 2, maxWidth: isMobile ? 270 : 350 }}>
          <Typography variant="subtitle2">{item.userName}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ maxWidth: 350 }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Box>
      </Box>
      <Typography variant="caption" color="text.disabled">
        {item.time}
      </Typography>
    </Box>
  );
}

export default FoundRasingCard;
