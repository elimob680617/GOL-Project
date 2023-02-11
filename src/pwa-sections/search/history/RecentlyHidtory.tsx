import { FC } from 'react';
import { FormattedMessage } from 'react-intl';

import { Stack } from '@mui/material';

import { useSelector } from 'src/store';
import { getRecently } from 'src/store/slices/search';
import { FilterByEnum } from 'src/types/serverTypes';

import SearchMessages from '../Search.messages';
import RowRecently from '../recenties/RowRecently';
import { SubtitleStyleStyle } from './History';

const RecentlyHidtory: FC = () => {
  const recentlies = useSelector(getRecently);

  return (
    <Stack sx={{ p: 2 }} spacing={2}>
      <SubtitleStyleStyle variant="subtitle2" sx={{ color: 'text.secondary' }}>
        <FormattedMessage {...SearchMessages.recently} />
      </SubtitleStyleStyle>

      {recentlies &&
        recentlies.hashtags &&
        recentlies.hashtags.map((hashtag) => (
          <RowRecently avatar="" name={hashtag.title ?? ''} varient={FilterByEnum.Hashtag ?? ''} key={hashtag.itemId} />
        ))}

      {recentlies &&
        recentlies.ngos &&
        recentlies.ngos.map((ngo) => (
          <RowRecently avatar="" name={ngo.fullName ?? ''} varient={FilterByEnum.Ngo ?? ''} key={ngo.itemId} />
        ))}

      {recentlies &&
        recentlies.people &&
        recentlies.people.map((people) => (
          <RowRecently
            avatar={people.avatarUrl ?? ''}
            name={people.fullName ?? ''}
            varient={FilterByEnum.Hashtag}
            key={people.itemId}
          />
        ))}
    </Stack>
  );
};

export default RecentlyHidtory;
