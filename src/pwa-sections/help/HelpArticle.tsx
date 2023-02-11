import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Box, Button, Divider, Stack, Typography } from '@mui/material';

import { useSetIsUsefulArticleCommandMutation } from 'src/_graphql/cms/mutations/setIsUsefulArticleCommand.generated';
import { useLazyGetHelpArticlesQueryQuery } from 'src/_graphql/cms/queries/getHelpArticlesQuery.generated';
import { useLazyGetHelpRelatedArticlesQueryQuery } from 'src/_graphql/cms/queries/getHelpRelatedArticles.generated';
// services !!
import { Icon } from 'src/components/Icon';
import Logo from 'src/components/Logo';

// components !!
import HelpFooter from './HelpFooter';
import HelpMessages from './HelpPwa.messages';
import HelpSearch from './HelpSearch';

// -----------------start -----------------------------
export default function HelpArticle() {
  // tolls !!!
  const navigate = useNavigate();

  // state for show thanks comment !
  const [showThanks, setShowThanks] = useState(false);
  const [searchArticles, setSearchArticles] = useState(false);

  // const id = router?.query?.id?.[0];
  const { id } = useParams();
  // ---services --------
  //queries !
  const [getHelpArticlesQuery, { data }] = useLazyGetHelpArticlesQueryQuery();
  const [getHelpRelatedArticlesQuery, { data: relatedArticleData }] = useLazyGetHelpRelatedArticlesQueryQuery();
  // mutations !
  // mutation !
  const [setIsUsefulArticleCommand] = useSetIsUsefulArticleCommandMutation();
  // useEffects!!
  useEffect(() => {
    getHelpArticlesQuery({ filter: { ids: ['065c28fa-1a9c-473e-8632-26ef56960736'] } });
  }, [getHelpArticlesQuery]);
  const HelpArticlesData = data?.getHelpArticlesQuery?.listDto?.items?.[0];

  useEffect(() => {
    getHelpRelatedArticlesQuery({
      filter: { dto: { id: id } },
    });
  }, [getHelpRelatedArticlesQuery, id]);
  const helpRelatedArticle = relatedArticleData?.getHelpRelatedArticlesQuery?.listDto?.items;
  // mutation !!--------
  // functions !
  const handleLikeArticle = async (likeValue: boolean) => {
    const resData: any = await setIsUsefulArticleCommand({
      article: {
        dto: { articleId: '61010e7f-6fc0-4179-9bd7-659aaf8dc176', isUseful: likeValue },
      },
    });
    if (resData?.data?.setIsUsefulArticleCommand?.isSuccess) {
      setShowThanks(true);
    }
  };
  //---- jsx---
  return (
    <>
      <Box>
        <Stack sx={{ mb: 2, px: 2, pt: 3, gap: 2 }} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" sx={{ gap: 1 }}>
            <Logo />
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

      <Stack>
        {searchArticles ? (
          <HelpSearch
            closeHelpCenter={() => {
              setSearchArticles(false);
            }}
          />
        ) : (
          <>
            <Stack spacing={2} justifyContent="center" sx={{ px: 2, mt: 3 }}>
              <Typography variant="subtitle1" color="text.primary">
                {HelpArticlesData?.title}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {HelpArticlesData?.content}
              </Typography>
            </Stack>
            <Stack spacing={2} sx={{ my: 3, mx: 2, py: 1, border: 1, borderColor: 'grey.100', borderRadius: 2 }}>
              {showThanks ? (
                <Stack spacing={1} alignItems="center">
                  <Icon name="Approve-Tick" type="solid" color="success.main" />

                  <Typography align="center" color="success.main" variant="subtitle2">
                    <FormattedMessage {...HelpMessages.pollText} />
                  </Typography>
                </Stack>
              ) : (
                <>
                  <Typography variant="body2" color="text.primary" sx={{ pl: 2 }}>
                    <FormattedMessage {...HelpMessages.pollQuestion} />
                  </Typography>
                  <Stack direction="row" alignItems="center" sx={{ px: 1, gap: 1 }}>
                    <Button
                      color="inherit"
                      sx={{ bgcolor: 'grey.100' }}
                      fullWidth
                      variant="contained"
                      size="small"
                      onClick={() => handleLikeArticle(true)}
                    >
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Icon name="Like" color="grey.500" />
                        <Typography variant="button" color="text.primary">
                          <FormattedMessage {...HelpMessages.yes} />
                        </Typography>
                      </Box>
                    </Button>
                    <Button
                      color="inherit"
                      sx={{ bgcolor: 'grey.100' }}
                      fullWidth
                      variant="contained"
                      onClick={() => handleLikeArticle(false)}
                    >
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Icon name="Dislike" color="grey.500" />
                        <Typography variant="button" color="text.primary">
                          <FormattedMessage {...HelpMessages.no} />
                        </Typography>
                      </Box>
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
            {helpRelatedArticle?.length && helpRelatedArticle?.length > 0 && (
              <Stack sx={{ px: 2 }}>
                <Typography variant="subtitle1" color="text.primary">
                  <FormattedMessage {...HelpMessages.relatedArticles} />
                </Typography>
                <Stack spacing={3} sx={{ mt: 3, mb: 6 }}>
                  {helpRelatedArticle?.map((item) => (
                    <Stack
                      key={item?.id}
                      spacing={1}
                      direction="row"
                      justifyContent="start"
                      alignItems="center"
                      onClick={() => navigate(`help/articles/${item?.id}`)}
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
              </Stack>
            )}
          </>
        )}
        <Box>
          <HelpFooter />
        </Box>
      </Stack>
    </>
  );
}
