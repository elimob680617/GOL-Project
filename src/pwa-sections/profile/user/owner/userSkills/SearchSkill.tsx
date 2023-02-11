import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Divider, Stack, Typography } from '@mui/material';

import { useCreatePersonSkillMutation } from 'src/_graphql/profile/skills/mutations/createPersonSkill.generated';
import { useCreateSkillMutation } from 'src/_graphql/profile/skills/mutations/createSkill.generated';
import { useLazyGetSkillsQuery } from 'src/_graphql/profile/skills/queries/getSkills.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import debounceFn from 'src/utils/debounce';

import SkillMessages from './SkillPwa.messages';

interface SearchSkillType {
  onChange: () => void;
}

export default function SearchSkill(props: SearchSkillType) {
  const { onChange } = props;
  const [isTyping, setIsTyping] = useState(false);
  const [getSkills, { data: getSkillsData, isFetching }] = useLazyGetSkillsQuery();
  const [createSkill] = useCreateSkillMutation();
  const [createPersonSkill] = useCreatePersonSkillMutation();
  const { formatMessage } = useIntl();

  // Query
  const handleChangeInputSearch = (val: string) => {
    // is typing status
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    // Query
    if (val.length > 2)
      debounceFn(() =>
        getSkills({
          filter: {
            dto: {
              title: val,
            },
          },
        }),
      );
  };

  // mutations!
  const handleChange = async (value: any & { inputValue?: string }) => {
    if (value.inputValue) {
      const resData: any = await createSkill({
        filter: {
          dto: {
            title: value.inputValue,
          },
        },
      });
      if (resData?.data?.createSkill?.isSuccess) {
        const newSkillId = resData?.data?.createSkill?.listDto?.items?.[0];
        await createPersonSkill({
          filter: {
            dto: {
              skillId: newSkillId.id,
            },
          },
        });
      }
    } else {
      await createPersonSkill({
        filter: {
          dto: {
            skillId: value.id,
          },
        },
      });
    }
    onChange();
  };

  return (
    <>
      <Stack spacing={2} sx={{ py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...SkillMessages.skillWord} />
            </Typography>
          </Box>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <AutoCompleteAddable
            loading={isFetching}
            onInputChange={(ev, val) => handleChangeInputSearch(val)}
            onChange={(ev, val) => handleChange(val)}
            options={getSkillsData?.getSkills?.listDto?.items || []}
            placeholder={formatMessage(SkillMessages.skillName)}
          />
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              {!isTyping && (
                <Typography color="text.secondary" variant="body2">
                  <FormattedMessage {...SkillMessages.startTypingToFindSkill} />
                </Typography>
              )}
            </Box>
          </Box>
        </Stack>
      </Stack>
    </>
  );
}
