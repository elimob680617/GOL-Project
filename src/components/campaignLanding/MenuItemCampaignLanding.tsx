import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Icon } from '../Icon';
import campaignLandingComponentsMessages from './campaignLandingComponentsMessages';

type ActionMenuType = 'campaign' | 'reports' | 'drafts' | 'donation';
interface IMenuItems {
  active: ActionMenuType;
}

const MenuItems = styled(IconButton)(({ theme }) => ({
  height: 76,
  width: 106,
  backgroundColor: theme.palette.surface.main,
  margin: 8,
  borderRadius: '8px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  cursor: 'pointer',
  color: theme.palette.text.secondary,
  ':hover': {
    backgroundColor: theme.palette.surface.main,
  },
}));

function MenuItemCampaignLanding(props: IMenuItems) {
  const { active } = props;
  const navigate = useNavigate();
  return (
    <Box display={'flex'} sx={{ overflow: 'auto' }}>
      <MenuItems
        onClick={() => (active === 'campaign' ? null : navigate('/campaigns'))}
        sx={{
          color: (theme) => (active === 'campaign' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Poverty-Alleviation" color={active === 'campaign' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          <FormattedMessage {...campaignLandingComponentsMessages.campaignsMenuItem} />
        </Typography>
      </MenuItems>
      <MenuItems
        onClick={() => (active === 'reports' ? null : navigate('/campaigns/reports'))}
        sx={{
          color: (theme) => (active === 'reports' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Report" color={active === 'reports' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          <FormattedMessage {...campaignLandingComponentsMessages.ReportsMenuItem} />
        </Typography>
      </MenuItems>
      <MenuItems
        onClick={() => (active === 'donation' ? null : navigate('/campaigns/donation'))}
        sx={{
          color: (theme) => (active === 'donation' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Saved" color={active === 'donation' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          <FormattedMessage {...campaignLandingComponentsMessages.DonationsMenuItem} />
        </Typography>
      </MenuItems>
      <MenuItems
        onClick={() => (active === 'drafts' ? null : navigate('/campaigns/drafts'))}
        sx={{
          color: (theme) => (active === 'drafts' ? theme.palette.primary.main : null),
        }}
      >
        <Icon name="Saved" color={active === 'drafts' ? 'primary.main' : 'grey.500'} size={32} />
        <Typography variant="subtitle1" sx={{ width: '100%' }}>
          <FormattedMessage {...campaignLandingComponentsMessages.DraftsMenuItem} />
        </Typography>
      </MenuItems>
    </Box>
  );
}

export default MenuItemCampaignLanding;
