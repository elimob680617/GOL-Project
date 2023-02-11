import React, { useState } from 'react';
import { isMobile } from 'react-device-detect';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import NoNotif from 'src/assets/icons/notification/noNotification.svg';
import { Icon } from 'src/components/Icon';
import { BirthdayCard, FoundRasingCard, GroupingCard, NotifCard, SecurityCard } from 'src/components/Notification';

import NotificationMessages from './notificationMessage';

interface ICardData {
  id?: number;
  useAvatar?: string;
  userName?: string;
  userType?: string;
  action?: string;
  time?: string;
  status?: boolean;
}
const RootStyle = styled(Box)(({ theme }) => ({
  width: isMobile ? '100%' : 480,
  backgroundColor: theme.palette.surface.main,
  borderRadius: '8px',
}));
/// mock data ///
const data = [
  {
    id: 1,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'masood Shaterabadi',
    userType: 'NGO',
    action: 'Follows you',
    time: '1h',
    status: true,
    activity: null,
    activityStatus: null,
  },
  {
    id: 2,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'sahand zamini',
    userType: 'NORMAL',
    action: 'Like your Photo',
    time: '2h',
    status: true,
    activity: false,
    activityStatus: true,
  },
  {
    id: 3,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'sahand zamini',
    userType: 'NORMAL',
    action: 'Added experience in ╣Charity Water╠',
    time: '2h',
    status: false,
    activity: false,
    activityStatus: false,
  },
  {
    id: 4,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'sahand zamini',
    userType: 'NORMAL',
    action: 'Unfollows you',
    time: '2h',
    status: true,
    activity: true,
    activityStatus: true,
  },
];
const securityData = [
  {
    id: 1,
    Icon: 'location',
    notification: 'You are logged in from a new location!',
    time: '1h',
  },
  {
    id: 2,
    Icon: 'mobile',
    notification: 'A new device has been added to your account!',
    time: '1h',
  },
  {
    id: 3,
    Icon: 'security',
    notification: 'Your password has been changed!',
    time: '1h',
  },
];
const GroupingData = [
  {
    id: 1,
    useAvatar: '',
    userName: 'Charity Water',
    userType: 'NGO',
    action: 'Added a new Video',
    time: '1h',
    status: false,
    cardType: 'video',
  },
  {
    id: 3,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Charity Water',
    userType: 'NGO',
    action: 'Added a new Video',
    time: '1h',
    status: true,
    cardType: 'video',
  },
  {
    id: 2,
    useAvatar: '',
    userName: 'Masood Shaterabadi',
    userType: 'USER',
    action: 'Added a new Photo',
    time: '1h',
    status: false,
    cardType: 'picture',
  },
  {
    id: 4,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Masood Shaterabadi',
    userType: 'USER',
    action: 'Added a new Photo',
    time: '1h',
    status: true,
    cardType: 'picture',
  },
];
const FoundData = [
  {
    id: 3,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Charity Water',
    userType: 'NGO',
    action: 'Donated to the ╣Global Giving campaign╠',
    time: '1h',
    status: true,
  },
  {
    id: 4,
    useAvatar: 'https://ugc-destination-bucket24.s3.amazonaws.com/58d293df-ce98-403d-b49a-a4d3cf61d285_0.jpeg',
    userName: 'Masood Shaterabadi',
    userType: 'USER',
    action: 'Donated $150 to the ╣Global Giving campaign╠',
    time: '1h',
    status: true,
  },
];
const birthdayData = [
  {
    id: 1,
    Icon: 'office-bag',
    notification: 'Ashkan Pordel is working for Company Moon NGO for the third year',
    time: '1h',
  },
  {
    id: 2,
    Icon: 'Building',
    notification: 'The fifth anniversary of the establishment of Company Moon Light company (23 April)',
    time: '1h',
  },
  {
    id: 3,
    Icon: 'Birthday',
    notification: `4 days left until Soheil najafi's birthday (23 April)`,
    time: '1h',
  },
];
/// mock data ///
function NotifSection() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [setting, setSetting] = useState<boolean>(false);
  const [cardData, setCardData] = useState<ICardData[]>(data);
  const openTreeDot = Boolean(anchorEl);
  const { formatMessage } = useIntl();
  const handleOpenTreeDot = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseTreeDot = () => {
    setAnchorEl(null);
    setSetting(false);
  };

  const handleSortNotification = (e: any) => {
    if (e.target.value === 'Reads') {
      setCardData(data.filter((i) => i.status === false));
    } else if (e.target.value === 'Unreads') {
      setCardData(data.filter((i) => i.status === true));
    } else {
      setCardData(data);
    }
  };
  return (
    <RootStyle>
      <Box sx={{ p: 2, pt: 1, pb: 1 }} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="subtitle1">
          <FormattedMessage {...NotificationMessages.Notifications} />
        </Typography>
        <IconButton
          id="basic-button"
          aria-controls={openTreeDot ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openTreeDot ? 'true' : undefined}
          onClick={handleOpenTreeDot}
        >
          <Icon name="Menu" type="solid" />
        </IconButton>
        {setting ? (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openTreeDot}
            onClose={handleCloseTreeDot}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="ShowAll"
                name="radio-buttons-group"
                onChange={handleSortNotification}
              >
                <MenuItem>
                  <FormControlLabel
                    value="ShowAll"
                    control={<Radio />}
                    label={formatMessage(NotificationMessages.sortShowAll)}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    value="Reads"
                    control={<Radio />}
                    label={formatMessage(NotificationMessages.sortReads)}
                  />
                </MenuItem>
                <MenuItem>
                  <FormControlLabel
                    value="Unreads"
                    control={<Radio />}
                    label={formatMessage(NotificationMessages.sortUnreads)}
                  />
                </MenuItem>
              </RadioGroup>
            </FormControl>
          </Menu>
        ) : (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openTreeDot}
            onClose={handleCloseTreeDot}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem>
              <Icon name="Read-Notifications" />
              <Typography sx={{ m: 1 }} variant="body2">
                <FormattedMessage {...NotificationMessages.MarkAllAsRead} />
              </Typography>
            </MenuItem>
            <MenuItem>
              <Icon name="Setting" />
              <Typography sx={{ m: 1 }} variant="body2">
                <FormattedMessage {...NotificationMessages.NotificationSetting} />
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => setSetting(true)}>
              <Icon name="Notifications-Category" />
              <Typography sx={{ m: 1 }} variant="body2">
                <FormattedMessage {...NotificationMessages.NotificationCategory} />
              </Typography>
            </MenuItem>
          </Menu>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        {!cardData?.length && !securityData?.length ? (
          <Box
            sx={{ width: '100%' }}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            flexWrap={'wrap'}
          >
            <img src={NoNotif} alt="noNotif" loading="lazy" />
            <Typography variant="caption" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
              <FormattedMessage {...NotificationMessages.ThereIsNoNotification} />
            </Typography>
          </Box>
        ) : (
          cardData.map((item, index) => (
            <Box key={index}>
              <NotifCard CardData={item} />
              {item?.status ? null : <Divider />}
            </Box>
          ))
        )}
        {securityData?.map((item, index) => (
          <Box key={index}>
            <SecurityCard item={item} />
          </Box>
        ))}
        {GroupingData?.map((item, index) => (
          <Box key={index}>
            <GroupingCard item={item} />
          </Box>
        ))}
        {FoundData?.map((item, index) => (
          <Box key={index}>
            <FoundRasingCard item={item} />
          </Box>
        ))}
        {birthdayData?.map((item, index) => (
          <Box key={index}>
            {' '}
            <BirthdayCard item={item} />
          </Box>
        ))}
      </Box>
    </RootStyle>
  );
}

export default NotifSection;
