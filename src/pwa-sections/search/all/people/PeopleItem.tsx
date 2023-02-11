import { FC, createRef } from 'react';

import { Avatar, Stack, Tooltip, Typography, styled } from '@mui/material';

import CustomLink from 'src/components/CustomLink';
import useIsOverflow from 'src/hooks/useIsOverflow';
import { PATH_APP } from 'src/routes/paths';
import ProfileButtonChecker from 'src/sections/profile/components/ProfileButtonChecker';
import { FilterByEnum } from 'src/types/serverTypes';
import { ISearchUserResponse } from 'src/types/user';

export const PeopleItemStyle = styled(Stack)(({ theme }) => ({
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[100]}`,
  padding: theme.spacing(2),
  width: '100%',
  height: 177,
}));

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  width: 48,
  height: 48,
}));

const PeopleItem: FC<{ people: ISearchUserResponse; index: number; varient?: 'ngo' | 'normal' }> = ({
  people,
  index,
  varient,
}) => {
  const fullnameRef = createRef<any>();
  const headlineRef = createRef<any>();
  const fullnameIsOverflow = useIsOverflow(fullnameRef);
  const headlineIsOverflow = useIsOverflow(headlineRef);

  const valuingLink = () =>
    varient === 'ngo'
      ? `${PATH_APP.profile.ngo.viewNgo}/${people.id}`
      : `${PATH_APP.profile.user.view.root}/${people.id}`;

  return (
    <>
      <PeopleItemStyle spacing={2}>
        <CustomLink path={valuingLink()}>
          <AvatarStyle variant={varient === 'ngo' ? 'rounded' : 'circular'} src={people.avatarUrl || ''} />
        </CustomLink>
        <Stack spacing={0.5} justifyContent="center" sx={{ width: '100%', flex: 1 }}>
          <Tooltip title={fullnameIsOverflow ? people.fullName ?? '' : ''} enterTouchDelay={0}>
            <Typography
              className="no-select"
              ref={fullnameRef}
              data-text={people.fullName}
              sx={{ width: '100%', textAlign: 'center' }}
              variant="subtitle2"
              color="text.primary"
              noWrap
            >
              <CustomLink path={valuingLink()}>{people.fullName}</CustomLink>
            </Typography>
          </Tooltip>
          <Tooltip title={headlineIsOverflow ? people.headline ?? '' : ''} enterTouchDelay={0}>
            <Typography
              className="no-select"
              ref={headlineRef}
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ width: '100%', textAlign: 'center' }}
            >
              <CustomLink path={valuingLink()}>{people.headline}</CustomLink>
            </Typography>
          </Tooltip>
        </Stack>

        <ProfileButtonChecker
          fullName={people.fullName ?? ''}
          itemId={people.id}
          itemType={varient === 'normal' ? FilterByEnum.Normal : FilterByEnum.Ngo}
          meToOther={people.meToOtherStatus as any}
          otherToMe={people.otherToMeStatus as any}
        />
      </PeopleItemStyle>
    </>
  );
};

export default PeopleItem;
