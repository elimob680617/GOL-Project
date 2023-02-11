import { FC } from 'react';

import { Checkbox, Chip, Stack, Tooltip, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import { SearchCategoryEnumType } from 'src/types/serverTypes';

interface IFundraisingCategoryFilterProps {
  selectedCategories: SearchCategoryEnumType[];
  categorySelected: (category: SearchCategoryEnumType) => void;
  categoryRemoved: (category: SearchCategoryEnumType) => void;
}

const FundraisingCategoryFilter: FC<IFundraisingCategoryFilterProps> = ({
  selectedCategories,
  categoryRemoved,
  categorySelected,
}) => {
  const checkChecked = (category: string) => selectedCategories.some((i) => i === category);

  return (
    <Stack spacing={2}>
      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedCategories.map((category) => (
          <Chip
            key={`selected-campaing-post-${category}`}
            label={category}
            onDelete={() => categoryRemoved(category)}
            deleteIcon={<Icon size={16} name="Close" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>

      <Stack alignItems="center" direction="row" spacing={1}>
        <Checkbox
          checked={checkChecked(SearchCategoryEnumType.Art)}
          onChange={() =>
            checkChecked(SearchCategoryEnumType.Art)
              ? categoryRemoved(SearchCategoryEnumType.Art)
              : categorySelected(SearchCategoryEnumType.Art)
          }
        />
        <img src="/icons/Campaign/Linear/Arts and culture.svg" width={32} height={32} alt="art" />
        <Tooltip title={SearchCategoryEnumType.Art}>
          <Typography noWrap data-text={SearchCategoryEnumType.Art} variant="subtitle2" color="text.primary">
            {SearchCategoryEnumType.Art}
          </Typography>
        </Tooltip>
      </Stack>
      <Stack alignItems="center" direction="row" spacing={1}>
        <Checkbox
          checked={checkChecked(SearchCategoryEnumType.Environment)}
          onChange={() =>
            checkChecked(SearchCategoryEnumType.Environment)
              ? categoryRemoved(SearchCategoryEnumType.Environment)
              : categorySelected(SearchCategoryEnumType.Environment)
          }
        />
        <Icon size={32} name="Agriculture" />
        <Tooltip title={SearchCategoryEnumType.Environment}>
          <Typography noWrap data-text={SearchCategoryEnumType.Environment} variant="subtitle2" color="text.primary">
            {SearchCategoryEnumType.Environment}
          </Typography>
        </Tooltip>
      </Stack>

      <Stack alignItems="center" direction="row" spacing={1}>
        <Checkbox
          checked={checkChecked(SearchCategoryEnumType.Health)}
          onChange={() =>
            checkChecked(SearchCategoryEnumType.Health)
              ? categoryRemoved(SearchCategoryEnumType.Health)
              : categorySelected(SearchCategoryEnumType.Health)
          }
        />
        <Icon size={32} name="Economic-Development" />
        <Tooltip title={SearchCategoryEnumType.Health}>
          <Typography noWrap data-text={SearchCategoryEnumType.Health} variant="subtitle2" color="text.primary">
            {SearchCategoryEnumType.Health}
          </Typography>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default FundraisingCategoryFilter;
