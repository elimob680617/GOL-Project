import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';

import { Box, Dialog, Divider, IconButton, Stack, Typography } from '@mui/material';

import { useCreatePersonSkillMutation } from 'src/_graphql/profile/skills/mutations/createPersonSkill.generated';
import { useCreateSkillMutation } from 'src/_graphql/profile/skills/mutations/createSkill.generated';
import { useLazyGetSkillsQuery } from 'src/_graphql/profile/skills/queries/getSkills.generated';
import AutoCompleteAddable from 'src/components/AutoCompleteAddable';
import { Icon } from 'src/components/Icon';
import { PATH_APP } from 'src/routes/paths';

import SkillMessages from './Skill.messages';

export default function SearchSkillDialog() {
  const router = useNavigate();
  const { formatMessage } = useIntl();
  const [isTyping, setIsTyping] = useState(false);
  const [getSkills, { data: getSkillsData, isFetching }] = useLazyGetSkillsQuery();
  const [createSkill] = useCreateSkillMutation();
  const [createPersonSkill] = useCreatePersonSkillMutation();

  // Query
  const handleChangeInputSearch = (val: string) => {
    // is typing status
    if (val) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
    // Query
    getSkills({
      filter: {
        dto: {
          title: val,
        },
      },
    });
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
        router(-1);
      }
    } else {
      await createPersonSkill({
        filter: {
          dto: {
            skillId: value.id,
          },
        },
      });
      router(-1);
    }
  };

  return (
    <Dialog fullWidth={true} open={true} keepMounted onClose={() => router(-1)}>
      <Stack spacing={2} sx={{ minWidth: 600, minHeight: 320, py: 3 }}>
        <Stack direction="row" spacing={2} sx={{ px: 2 }} alignItems="center" justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton sx={{ p: 0 }} onClick={() => router(-1)}>
              <Icon name="left-arrow" />
            </IconButton>
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...SkillMessages.skillWord} />
            </Typography>
          </Box>
          <Link to={PATH_APP.profile.user.root}>
            <IconButton>
              <Icon name="Close" />
            </IconButton>
          </Link>
        </Stack>
        <Divider />
        <Stack spacing={2} sx={{ px: 2 }}>
          <AutoCompleteAddable
            autoFocus
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
    </Dialog>
  );
}
