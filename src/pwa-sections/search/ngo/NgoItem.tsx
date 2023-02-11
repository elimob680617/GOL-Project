import { FC, createRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Stack, Tooltip, styled } from '@mui/material';

import { useAddLastSeenMutation } from 'src/_graphql/search/mutations/addLastSeen.generated';
import useIsOverflow from 'src/hooks/useIsOverflow';
import { PATH_APP } from 'src/routes/paths';
import ProfileButtonChecker from 'src/sections/profile/components/ProfileButtonChecker';
import { FilterByEnum, ItemTypeEnum } from 'src/types/serverTypes';
import { ISearchNgoReponse } from 'src/types/user';

import { ClickableText } from '../SharedStyled';

export const NgoItemStyle = styled(Stack)(({ theme }) => ({}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1),
}));

const NgoItem: FC<{ ngo: ISearchNgoReponse; index: number }> = ({ index, ngo }) => {
  const navigate = useNavigate();
  const fullnameRef = createRef<any>();
  const fullnameIsOverflow = useIsOverflow(fullnameRef);
  const [addLastSeenRequest] = useAddLastSeenMutation();

  const handleRouting = () => {
    addLastSeenRequest({ filter: { dto: { itemId: ngo.id, itemType: ItemTypeEnum.Ngos } } });
    navigate(`${PATH_APP.profile.ngo.viewNgo}/${ngo.id}`);
  };
  return (
    <>
      <NgoItemStyle direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Stack sx={{ flex: 1, overflow: 'hidden' }} direction="row" alignItems="center" spacing={2}>
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ width: 48, height: 48, border: (theme) => `1px solid ${theme.palette.grey[100]}`, borderRadius: 1 }}
          >
            <AvatarStyle
              onClick={() => {
                handleRouting();
              }}
              variant="square"
              src={ngo.avatarUrl || ''}
            >
              {!ngo.avatarUrl && ngo?.fullName?.[0]}
            </AvatarStyle>
          </Stack>
          <Tooltip title={fullnameIsOverflow ? ngo.fullName ?? '' : ''} enterTouchDelay={0}>
            <ClickableText
              onClick={() => {
                handleRouting();
              }}
              ref={fullnameRef}
              variant="subtitle1"
              color="surface.onSurface"
              noWrap
              sx={{ width: 'calc(100% - 48px)' }}
            >
              {ngo.fullName}
            </ClickableText>
          </Tooltip>
        </Stack>
        <ProfileButtonChecker
          fullName={ngo.fullName ?? ''}
          itemId={ngo.id}
          itemType={FilterByEnum.Ngo}
          meToOther={ngo.meToOtherStatus as any}
          otherToMe={ngo.otherToMeStatus as any}
        />
      </NgoItemStyle>
    </>
  );
};

export default NgoItem;
