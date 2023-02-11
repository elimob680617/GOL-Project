import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';

// import gardenOfLoveLogo from 'src/assets/logo/logo.png';
import { Icon } from 'src/components/Icon';
import { ArticleResponseType } from 'src/types/serverTypes';

import { HelpCategoryType } from './HelpCenter';
import HelpFooter from './HelpFooter';
import HelpMessages from './HelpPwa.messages';
import HelpSearch from './HelpSearch';

// ----------------------------------------------

export default function HelpItems() {
  const categoryItemsDataJson = localStorage.getItem('categoryItems');
  const categoryItemsData = JSON.parse(categoryItemsDataJson as string);
  const [category, setCategory] = useState(categoryItemsData);
  const [searchArticles, setSearchArticles] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  // local Storage !!!

  // -------------

  useEffect(() => {
    if (id) {
      setCategory(categoryItemsData?.subCategory?.find((item: any) => item.id === id));
    }
  }, [id, categoryItemsData?.subCategory]);

  // jsx of help center----------
  return (
    <Stack>
      <Box>
        <Stack sx={{ mb: 2, px: 2, pt: 3 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            {/* <Image src={gardenOfLoveLogo} alt="logo" /> */}
            <Typography variant="subtitle1" color="text.primary">
              <FormattedMessage {...HelpMessages.helpCenter} />
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" sx={{ gap: 3 }}>
            <Box
              onClick={() => {
                setSearchArticles(true);
              }}
            >
              <Icon name="Research" type="solid" color="grey.500" />
            </Box>

            <Icon name="Menu" type="solid" color="grey.500" />
          </Stack>
        </Stack>
        <Divider />
      </Box>
      {searchArticles ? (
        <HelpSearch
          closeHelpCenter={() => {
            setSearchArticles(false);
          }}
        />
      ) : (
        <Stack>
          <Stack sx={{ minHeight: 'calc(100vh - 300px)' }}>
            <Stack spacing={2} sx={{ px: 2, my: 3 }}>
              <Typography variant="subtitle1" color="text.primary">
                {category?.title}
              </Typography>
              {category?.description && (
                <Typography variant="body1" color="text.primary">
                  {category?.description}
                </Typography>
              )}
            </Stack>
            <Stack spacing={2} sx={{ px: 2, mb: 11 }}>
              {category?.subCategory?.length > 0 ? (
                <>
                  {category?.subCategory?.map((item: HelpCategoryType) => (
                    <Stack
                      key={item?.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ pl: 2, pr: 2, bgcolor: 'background.neutral', py: 1, borderRadius: 1 }}
                      onClick={() => navigate(`category/?categoryId=${item.id}`)}
                    >
                      <Typography variant="subtitle2" color="text.primary">
                        {item?.title}
                      </Typography>
                      <IconButton sx={{ p: 0 }}>
                        <Icon name="right-arrow-1" color="grey.500" />
                      </IconButton>
                    </Stack>
                  ))}
                </>
              ) : (
                <>
                  {category?.articles?.map((item: ArticleResponseType) => (
                    <Stack
                      key={item?.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ pl: 2, pr: 2, bgcolor: 'background.neutral', py: 1, borderRadius: 1 }}
                      onClick={() => navigate(`help/articles/${item?.id}`)}
                    >
                      <Typography variant="subtitle2" color="text.primary">
                        {item?.title}
                      </Typography>
                      <IconButton sx={{ p: 0 }}>
                        <Icon name="right-arrow-1" color="grey.500" />
                      </IconButton>
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </Stack>

          <HelpFooter />
        </Stack>
      )}
    </Stack>
  );
}
