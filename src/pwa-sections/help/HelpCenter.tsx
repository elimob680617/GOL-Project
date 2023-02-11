import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Avatar, Box, Divider, Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material';

import { useLazyGetHelpCategoriesQueryQuery } from 'src/_graphql/cms/queries/getHelpCategoriesQuery.generated';
import { useLazyGetPopularHelpQueryQuery } from 'src/_graphql/cms/queries/getPopularHelpQuery.generated';
import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';
import Logo from 'src/components/Logo';
import { CategoryResponseType } from 'src/types/serverTypes';

import HelpFooter from './HelpFooter';
import HelpMessages from './HelpPwa.messages';
import HelpSearch from './HelpSearch';

export type HelpCategoryType = CategoryResponseType & {
  subCategory?: CategoryResponseType[];
};

const HelpCenter = () => {
  // tools !

  const navigate = useNavigate();
  // useState
  const [searchArticles, setSearchArticles] = useState(false);

  // services !!
  // query !
  const [getHelpCategoriesQuery, { data: categoryData }] = useLazyGetHelpCategoriesQueryQuery();
  const [getHelpPopularArticle, { data: popularArticleData }] = useLazyGetPopularHelpQueryQuery();

  useEffect(() => {
    getHelpPopularArticle({
      filter: { slug: 'en-US' },
    });

    getHelpCategoriesQuery({
      filter: {
        dto: {},
      },
    });
  }, [getHelpCategoriesQuery, getHelpPopularArticle]);
  const helpCategoriesData = categoryData?.getHelpCategoriesQuery?.listDto?.items;
  const popularArticles = popularArticleData?.getPopularHelpQuery?.listDto?.items;
  // ------------------make tree for date
  const helpCategories = useMemo(() => {
    const parentCategories = helpCategoriesData?.filter((c) => c?.parentId === null);
    const result = parentCategories?.map((parent) => ({
      ...parent,
      subCategory: helpCategoriesData?.filter((category) => category?.parentId === parent?.id),
    }));
    return result;
  }, [helpCategoriesData]);

  // -------------

  // local storage !!
  function handleCategory(categoryItems: HelpCategoryType) {
    localStorage.setItem('categoryItems', JSON.stringify(categoryItems));
    navigate('help/category');
  }

  //   ----------------start project design-----------------------
  return (
    <Box>
      <Stack sx={{ mb: 2, px: 2, pt: 3, gap: 2, position: 'sticky' }} direction="row" alignItems="center">
        <Logo />
        <Typography variant="subtitle1" color="text.primary">
          <FormattedMessage {...HelpMessages.helpCenter} />
        </Typography>
      </Stack>
      <Divider />
      <Stack>
        {searchArticles ? (
          <HelpSearch
            closeHelpCenter={() => {
              setSearchArticles(false);
            }}
          />
        ) : (
          // -----------------------------------------------
          <Stack sx={{ px: 2, mb: 3 }}>
            <Typography variant="body1" color="text.primary" sx={{ my: 3 }}>
              <FormattedMessage {...HelpMessages.help} />
            </Typography>
            <TextField
              onClick={() => {
                setSearchArticles(true);
              }}
              size="small"
              name="search"
              type="text"
              placeholder="Type key word to find answers"
              fullWidth
              inputProps={{ maxLength: 200 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon name="Research" type="solid" color="grey.500" />
                  </InputAdornment>
                ),
              }}
            />
            <Grid container spacing={1} mt={4}>
              {helpCategories?.map((item) => (
                <Grid
                  item
                  xs={6}
                  key={item.id}
                  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <Box
                    onClick={() => handleCategory(item as CategoryResponseType)}
                    sx={{
                      minHeight: 150,
                      border: 1,
                      borderColor: 'grey.100',
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      p: 2,
                    }}
                  >
                    <Image src="src/assets/icons/policy,rule,reporting.svg" width={120} height={77} alt="#" />
                    <Typography align="center">{item?.title}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
        {!searchArticles && (
          <Stack spacing={2} sx={{ mx: 2, p: 2, mb: 3, bgcolor: 'background.neutral', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.primary">
              <FormattedMessage {...HelpMessages.popular} />
            </Typography>
            {popularArticles?.map((item) => (
              <Stack
                key={item?.id}
                spacing={1}
                direction="row"
                justifyContent="start"
                alignItems="center"
                onClick={() => navigate(`help/articles/${item?.id}`)}
                sx={{ bgcolor: 'background.paper', p: 1, borderRadius: 1 }}
              >
                <Avatar alt="Profile Picture" sx={{ backgroundColor: 'background.neutral' }}>
                  <Icon name="notes" color="grey.700" />
                </Avatar>
                <Typography variant="body2" color="text.primary">
                  {item?.title}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
        <Box>
          <HelpFooter />
        </Box>
      </Stack>
    </Box>
  );
};

export default HelpCenter;
