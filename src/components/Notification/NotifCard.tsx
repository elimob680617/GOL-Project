import { useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import ReactDOMServer from 'react-dom/server';
import { FormattedMessage } from 'react-intl';

import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { PATH_APP } from 'src/routes/paths';
import { PRIMARY } from 'src/theme/palette';
import { UserTypeEnum } from 'src/types/serverTypes';

import NotificationMessageComponents from './NotificationMessageComponents';

type cardData = {
  id?: number;
  useAvatar?: string;
  userName?: string;
  userType?: string;
  action?: string;
  time?: string;
  status?: boolean;
  activity?: boolean | null;
  activityStatus?: boolean | null;
};

interface INotifCard {
  CardData: cardData;
}

const MentionId = styled('span')(({ theme }) => ({}));

function NotifCard(props: INotifCard) {
  const { CardData } = props;
  console.log(CardData);
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
    if (!CardData) return;
    let bodyData = CardData.action;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CardData]);

  return (
    <Box
      sx={{
        mt: 1,
        p: 1,
        borderRadius: '8px',
        bgcolor: CardData.status ? (theme) => theme.palette.grey[100] : null,
      }}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      flexWrap={'wrap'}
    >
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Avatar src={CardData.useAvatar} variant={CardData?.userType === UserTypeEnum.Ngo ? 'rounded' : 'circular'} />
        <Box sx={{ ml: 2, maxWidth: isMobile ? 200 : 350 }}>
          <Typography variant="subtitle2">{CardData.userName}</Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ maxWidth: 20 }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Box>
      </Box>
      <Box>
        {CardData.activityStatus !== null && CardData.activity === false ? (
          <Typography variant="caption" color="text.disabled" sx={{ mr: 1 }}>
            {CardData.activityStatus === true ? (
              <Typography variant="button" color="primary.main">
                <FormattedMessage {...NotificationMessageComponents.Accepted} />
              </Typography>
            ) : (
              <Typography variant="button" color="text.secondary">
                <FormattedMessage {...NotificationMessageComponents.Rejected} />
              </Typography>
            )}
          </Typography>
        ) : null}
        <Typography variant="caption" color="text.disabled">
          {CardData.time}
        </Typography>
      </Box>
      {CardData.activity && CardData.activityStatus !== null ? (
        <Grid container spacing={1} xs={12} sx={{ width: '100%', mt: 2, mb: 1 }}>
          <Grid item xs={8}>
            <Button variant="contained" sx={{ width: '100%' }}>
              <FormattedMessage {...NotificationMessageComponents.Accept} />
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button variant="outlined" color="inherit" sx={{ width: '100%' }}>
              <FormattedMessage {...NotificationMessageComponents.Reject} />
            </Button>
          </Grid>
        </Grid>
      ) : null}
    </Box>
  );
}

export default NotifCard;
