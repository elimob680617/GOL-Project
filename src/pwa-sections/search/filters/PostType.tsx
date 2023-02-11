import { FC } from 'react';
import { useIntl } from 'react-intl';

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';

import SearchMessages from '../Search.messages';

interface INgoSortProps {
  postType: string;
  postTypeChanged: (sort: string) => void;
}

const PostType: FC<INgoSortProps> = ({ postType, postTypeChanged }) => {
  const { formatMessage } = useIntl();

  return (
    <FormControl>
      <RadioGroup
        defaultValue={postType}
        value={postType}
        onChange={(e) => postTypeChanged(e.target.value)}
        name="post-type"
      >
        <FormControlLabel
          sx={{ marginBottom: 1 }}
          value="Social"
          control={<Radio />}
          label={formatMessage({ ...SearchMessages.social })}
        />
        <FormControlLabel
          sx={{ marginBottom: 1 }}
          value="Article"
          control={<Radio />}
          label={formatMessage({ ...SearchMessages.article })}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default PostType;
