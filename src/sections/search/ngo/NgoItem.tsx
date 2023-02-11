import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { Avatar, Stack, styled } from '@mui/material';

import { useAddLastSeenMutation } from 'src/_graphql/search/mutations/addLastSeen.generated';
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
  const [addLastSeenRequest] = useAddLastSeenMutation();

  const handleRouting = () => {
    addLastSeenRequest({ filter: { dto: { itemId: ngo.id, itemType: ItemTypeEnum.Ngos } } });
    navigate(`${PATH_APP.profile.ngo.viewNgo}/${ngo.id}`);
  };

  return (
    <>
      <NgoItemStyle
        sx={{ width: '100%' }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack sx={{ width: 'calc(100% - 136px)' }} direction="row" alignItems="center" spacing={2}>
          <AvatarStyle
            onClick={() => {
              handleRouting();
            }}
            variant="square"
            src={ngo.avatarUrl || ''}
          >
            {(!ngo.avatarUrl && ngo.fullName![0]) || ''}
          </AvatarStyle>

          <ClickableText
            sx={{ width: '100%' }}
            textOverflow="ellipsis"
            noWrap
            variant="subtitle1"
            color="surface.onSurface"
            onClick={() => {
              handleRouting();
            }}
          >
            {ngo.fullName}
          </ClickableText>
        </Stack>
        <ProfileButtonChecker
          fullName={ngo.fullName || ''}
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
