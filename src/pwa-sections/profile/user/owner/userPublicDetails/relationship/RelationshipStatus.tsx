import { FormattedMessage } from 'react-intl';

import { Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';

import { useGetRelationshipStatusQuery } from 'src/_graphql/profile/publicDetails/queries/getRelationshipStatus.generated';
import { RelationshipStatus } from 'src/types/serverTypes';

import NormalPublicDetailsMessages from '../NormalPublicDetailsPwa.messages';

interface RelationshipStatusProps {
  onChange: (value: RelationshipStatus) => void;
}

function RelationshipStatusForm(props: RelationshipStatusProps) {
  const { onChange } = props;
  const { data: relationship, isFetching: loadingRelationship } = useGetRelationshipStatusQuery({
    filter: {
      all: true,
    },
  });

  const handleChangeStatus = (status: RelationshipStatus) => {
    onChange(status);
  };

  return (
    <Stack spacing={2} sx={{ py: 3 }}>
      <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1" color="text.primary">
            <FormattedMessage {...NormalPublicDetailsMessages.relationshipStatus} />
          </Typography>
        </Box>
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
  );
}

export default RelationshipStatusForm;
