import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, CircularProgress, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useGetRelationshipStatusQuery } from 'src/_graphql/profile/publicDetails/queries/getRelationshipStatus.generated';
import { Icon } from 'src/components/Icon';
import { useDispatch, useSelector } from 'src/store';
import { userRelationShipSelector, userRelationShipUpdate } from 'src/store/slices/profile/userRelationShip-slice';
import { RelationshipStatus } from 'src/types/serverTypes';

import NormalPublicDetailsMessages from '../NormalPublicDetails.messages';

function RelationshipStatusDialog() {
  const { data: relationship, isFetching: loadingRelationship } = useGetRelationshipStatusQuery({
    filter: {
      all: true,
    },
  });
  const dispatch = useDispatch();
  const relationShip = useSelector(userRelationShipSelector);
  const navigate = useNavigate();
  const handleChangeStatus = (status: RelationshipStatus) => {
    dispatch(userRelationShipUpdate({ ...relationShip, relationshipStatus: status, isChange: true }));
    // relationShip.relationshipStatus?.title;
    navigate(-1);
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => navigate(-1)}>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => navigate(-1)}>
              <Icon name="left-arrow-1" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...NormalPublicDetailsMessages.relationshipStatus} />
            </Typography>
          </Box>
          <Link to={'/profile/close-dialog'}>
            <IconButton>
              <Icon name="Close-1" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          {loadingRelationship ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            relationship?.getRelationshipStatus?.listDto?.items?.map((rel) => (
              <Box
                key={rel?.id}
                sx={{ display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}
                onClick={() => handleChangeStatus(rel as RelationshipStatus)}
              >
                <Typography variant="body2" color="text.primary">
                  {rel?.title}
                </Typography>
              </Box>
            ))
          )}
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default RelationshipStatusDialog;
