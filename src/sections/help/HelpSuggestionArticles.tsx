import { SetStateAction, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Avatar, Box, Skeleton, Stack, Typography, styled } from '@mui/material';

import { useLazyGetHelpCategoriesQueryQuery } from 'src/_graphql/cms/queries/getHelpCategoriesQuery.generated';
import { useLazyGetPopularHelpQueryQuery } from 'src/_graphql/cms/queries/getPopularHelpQuery.generated';
import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';
import { CategoryResponseType } from 'src/types/serverTypes';

import HelpMessages from './Help.messages';

const StackStyle = styled(Stack)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  border: `1px solid ${theme.palette.grey[100]}`,
  padding: theme.spacing(5),
  width: 280,
  height: 160,
  textAlign: 'center',
  cursor: 'pointer',
}));

function HelpSuggestionArticles(props: {
  setIsArticleId: React.Dispatch<React.SetStateAction<string>>;
  setIsCategoryId: React.Dispatch<React.SetStateAction<string>>;
  helpCategories: any;
}) {
  const { setIsArticleId, setIsCategoryId, helpCategories } = props;

  const [getHelpCategories, { isFetching: categoryFetching }] = useLazyGetHelpCategoriesQueryQuery();
  const [getHelpPopularArticle, { data, isFetching }] = useLazyGetPopularHelpQueryQuery();

  useEffect(() => {
    getHelpCategories({ filter: { slug: 'en-US' } });
    getHelpPopularArticle({
      filter: { slug: 'en-US' },
    });
  }, [getHelpCategories, getHelpPopularArticle]);

  const popularArticles = data?.getPopularHelpQuery?.listDto?.items;
  // const helpCategory = helpCategories?.getHelpCategoriesQuery?.listDto?.items;

  function handleCategory(categoryItems: SetStateAction<string>) {
    // localStorage.setItem('categoryItems', JSON.stringify(categoryItems));
    setIsCategoryId(categoryItems);
  }

  return (
    <Box sx={{ backgroundColor: 'background.paper', width: 648, borderRadius: 1, px: 4, py: 4 }}>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        <FormattedMessage {...HelpMessages.help} />
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} mb={3}>
        {/* FIXME: Array Must Be Have 2 Index */}
        {categoryFetching ? (
          <>
            {[...Array(1)].map((i, index) => (
              <Skeleton variant="rectangular" width="100%" height={160} sx={{ borderRadius: 1 }} key={index} />
            ))}
          </>
        ) : (
          <>
            {helpCategories?.map((category: CategoryResponseType) => (
              <StackStyle key={category?.id} onClick={() => handleCategory(category?.id as string)}>
                <Box>
                  {/* FIXME: Src Att Must Be Correct Value From Service ==> category?.IconUrl */}
                  <Image src="src/assets/icons/account management.svg" alt={`${category?.title} Icon`} />
                </Box>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>
                  {category?.title}
                </Typography>
              </StackStyle>
            ))}
          </>
        )}
      </Stack>

      <Stack spacing={2} sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          <FormattedMessage {...HelpMessages.popular} />
        </Typography>
        {isFetching ? (
          <>
            {[...Array(6)].map((i, index) => (
              <Skeleton variant="rectangular" width="100%" height={72} sx={{ borderRadius: 1 }} key={index} />
            ))}
          </>
        ) : (
          <>
            {popularArticles?.map((article) => (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  onClick={() => setIsArticleId(article?.id)}
                  sx={{ py: 2, bgcolor: 'background.paper', borderRadius: 1, cursor: 'pointer' }}
                >
                  <Avatar sx={{ bgcolor: 'background.neutral', mx: 2 }}>
                    <Icon name="notes" color="grey.700" />
                  </Avatar>
                  <Typography alignContent="center" variant="body1" color="text.primary">
                    {article?.title}
                  </Typography>
                </Stack>
              </>
            ))}
          </>
        )}
      </Stack>
    </Box>
  );
}

export default HelpSuggestionArticles;
