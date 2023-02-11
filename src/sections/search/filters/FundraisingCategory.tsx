import { FC } from 'react';

import { Avatar, Checkbox, Chip, Stack, Tooltip, Typography } from '@mui/material';

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
            key={`selected-college-${category}`}
            label={category}
            onDelete={() => categoryRemoved(category)}
            deleteIcon={<img src="/icons/close.svg" width={16} height={16} alt="remove" />}
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
        <Avatar src="/icons/Campaign/Linear/Arts and culture.svg" sx={{ width: 32, height: 32 }} />
        <Tooltip title={SearchCategoryEnumType.Art}>
          <Typography noWrap data-text={SearchCategoryEnumType.Art} variant="subtitle2" color="text.primary">
            Arts and culture
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
        <Avatar src="/icons/Campaign/Linear/Agriculture.svg" sx={{ width: 32, height: 32 }} />
        <Tooltip title={SearchCategoryEnumType.Environment}>
          <Typography noWrap data-text={SearchCategoryEnumType.Art} variant="subtitle2" color="text.primary">
            Agriculture
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
        <Avatar src="/icons/Campaign/Linear/Economic Development.svg" sx={{ width: 32, height: 32 }} />
        <Tooltip title={SearchCategoryEnumType.Health}>
          <Typography noWrap data-text={SearchCategoryEnumType.Health} variant="subtitle2" color="text.primary">
            Economic Development
          </Typography>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default FundraisingCategoryFilter;
