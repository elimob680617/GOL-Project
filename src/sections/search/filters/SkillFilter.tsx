import { FC, useEffect, useState } from 'react';

import {
  Avatar,
  Checkbox,
  Chip,
  CircularProgress,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import { useLazyGetSkillForFilterQuery } from 'src/_graphql/search/filters/queries/getSkillForFilter.generated';
import { Icon } from 'src/components/Icon';
import useDebounce from 'src/hooks/useDebounce';
import { ISkil } from 'src/types/skill';

interface ISkillFilterProps {
  selectedSkills: ISkil[];
  skillSelected: (skill: ISkil) => void;
  skillRemoved: (skill: ISkil) => void;
}

const SkillFilter: FC<ISkillFilterProps> = ({ selectedSkills, skillRemoved, skillSelected }) => {
  const [searchedValue, setSearchedValue] = useState<string | null>(null);
  const searchedSkillDebouncedValue = useDebounce<string | null>(searchedValue, 500);

  const [getSkills, { isFetching: gettingSkillLoading, data: skills }] = useLazyGetSkillForFilterQuery();

  useEffect(() => {
    if (searchedSkillDebouncedValue === null) return;
    getSkills({ filter: { dto: { searchText: searchedSkillDebouncedValue } } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedSkillDebouncedValue]);

  const checkChecked = (skill: ISkil) => selectedSkills.some((i) => i === skill);

  return (
    <Stack spacing={2}>
      <TextField
        value={searchedValue}
        onChange={(e) => setSearchedValue(e.target.value)}
        size="small"
        id="skill"
        placeholder="Skill"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Icon size={24} name="Research" />
            </InputAdornment>
          ),
        }}
      />
      <Stack spacing={1} gap={1} direction="row" flexWrap="wrap">
        {selectedSkills.map((skill) => (
          <Chip
            key={`selected-skill-${skill.id}`}
            label={skill.title}
            onDelete={() => skillRemoved(skill)}
            deleteIcon={<Icon size={16} name="Close" />}
            sx={{ maxWidth: '100%' }}
          />
        ))}
      </Stack>
      {gettingSkillLoading && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      {!gettingSkillLoading && (
        <>
          {skills &&
            skills?.skillSearchQueryHandler &&
            skills?.skillSearchQueryHandler?.listDto &&
            skills?.skillSearchQueryHandler?.listDto?.items &&
            skills?.skillSearchQueryHandler?.listDto?.items.slice(0, 5).map((skill) => (
              <Stack key={skill!.id} alignItems="center" direction="row" spacing={1}>
                <Checkbox
                  checked={checkChecked(skill!)}
                  onChange={() => (checkChecked(skill!) ? skillRemoved(skill!) : skillSelected(skill!))}
                />
                <Avatar sx={{ width: 32, height: 32 }}>{skill!.title![0] || ''}</Avatar>
                <Tooltip title={skill!.title! || ''}>
                  <Typography noWrap data-text={skill!.title! || ''} variant="subtitle2" color="text.primary">
                    {skill!.title! || ''}
                  </Typography>
                </Tooltip>
              </Stack>
            ))}
        </>
      )}
    </Stack>
  );
};

export default SkillFilter;
