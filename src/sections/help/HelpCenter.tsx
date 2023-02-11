import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { Box, Container, Link, Stack, Typography } from '@mui/material';

import { useLazyGetHelpArticlesQueryQuery } from 'src/_graphql/cms/queries/getHelpArticlesQuery.generated';
import { useLazyGetHelpCategoriesQueryQuery } from 'src/_graphql/cms/queries/getHelpCategoriesQuery.generated';
import Logo from 'src/components/Logo';
import { PATH_APP } from 'src/routes/paths';
import HelpSideBar, { HelpCategoryType } from 'src/sections/help/HelpSideBar';
import { ArticleResponseType, CategoryResponseType } from 'src/types/serverTypes';
import debounceFn from 'src/utils/debounce';

import HelpMessages from './Help.messages';
import HelpArticlesContent from './HelpArticlesContent';
import HelpCategoryDetail from './HelpCategoryDetail';
import HelpSuggestionArticles from './HelpSuggestionArticles';

function HelpCenter() {
  const push = useNavigate();
  const [isArticelId, setIsArticleId] = useState<string>('');
  const [isCategoryId, setIsCategoryId] = useState<string>('');
  const [searchBarData, setSearchBarData] = useState('');

  const [getHelpCategories, { data, isFetching: categoryFetching }] = useLazyGetHelpCategoriesQueryQuery();
  const [getHelpArticle, { data: articleData, isFetching: articleFetching }] = useLazyGetHelpArticlesQueryQuery();

  useEffect(() => {
    getHelpCategories({ filter: { slug: 'en-US' } });
    debounceFn(() => {
      getHelpArticle({
        filter: {
          ids: [],
          slug: 'en-US',
          pageSize: 1,
          pageIndex: 0,
          dto: { searchTerm: searchBarData },
        },
      });
    });
  }, [getHelpArticle, getHelpCategories, searchBarData]);

  const helpCategory = data?.getHelpCategoriesQuery?.listDto?.items;
  const articleContents = articleData?.getHelpArticlesQuery?.listDto?.items;

  const helpCategories = useMemo(() => {
    const parentCategories = helpCategory?.filter((c) => c?.parentId === null);
    const result = parentCategories?.map((parent) => ({
      ...parent,
      subCategory: helpCategory?.filter((category) => category?.parentId === parent?.id) as CategoryResponseType[],
    }));
    return result;
  }, [helpCategory]);

  console.log(helpCategories);

  return (
    <>
      <Stack sx={{ position: 'relative' }}>
        <Box width="100%" sx={{ bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Stack justifyContent="space-between" alignItems="center" direction="row">
              <Stack justifyContent="space-between" alignItems="center" direction="row">
                <Box sx={{ pr: 2, py: 2, cursor: 'pointer' }} onClick={() => push(PATH_APP.home.index)}>
                  <Logo />
                </Box>
                <Link href="./" underline="none">
                  <Typography variant="h6" sx={{ color: 'grey.900', cursor: 'pointer' }}>
                    <FormattedMessage {...HelpMessages.helpCenter} />
                  </Typography>
                </Link>
              </Stack>
            </Stack>
          </Container>
        </Box>
        <Box sx={{ bgcolor: 'background.neutral', height: 'max-content' }}>
          <Container>
            <Stack direction="row" gap={3} sx={{ my: 3 }}>
              <HelpSideBar
                setIsArticleId={setIsArticleId}
                searchBarData={searchBarData}
                setSearchBarData={setSearchBarData}
                helpCategories={helpCategories as HelpCategoryType[]}
                articleContents={articleContents as ArticleResponseType[]}
                categoryFetching={categoryFetching}
                articleFetching={articleFetching}
                // subCategory={subCategory}
              />
              {!!isCategoryId ? (
                <HelpCategoryDetail
                  isCategoryId={isCategoryId}
                  setIsCategoryId={setIsCategoryId}
                  setIsArticleId={setIsArticleId}
                  helpCategories={helpCategories as HelpCategoryType[]}
                />
              ) : (
                <>
                  {!!isArticelId ? (
                    <HelpArticlesContent
                      articelId={isArticelId}
                      setIsArticleId={setIsArticleId}
                      articleContents={articleContents as ArticleResponseType}
                    />
                  ) : (
                    <HelpSuggestionArticles
                      setIsArticleId={setIsArticleId}
                      setIsCategoryId={setIsCategoryId}
                      helpCategories={helpCategories}
                    />
                  )}
                </>
              )}
            </Stack>
          </Container>
        </Box>
        <Box width="100%" height="66px" sx={{ bgcolor: 'background.paper', maxHeight: '66px' }}>
          <Container maxWidth="lg">
            <Stack justifyContent="center" alignItems="center" sx={{ position: 'absolute', bottom: 0 }}>
              <Stack justifyContent="space-between" direction="row" spacing={8} sx={{ py: 3 }}>
                <Stack direction="row" spacing={3}>
                  <Typography variant="subtitle2">
                    <FormattedMessage {...HelpMessages.gol} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.language} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.about} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.privacyPolicy} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.legal} />
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3}>
                  <Typography variant="subtitle2">
                    <FormattedMessage {...HelpMessages.company} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.termsOfServices} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.cookies} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.whitepaper} />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <FormattedMessage {...HelpMessages.contact} />
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Stack>
    </>
  );
}

export default HelpCenter;
