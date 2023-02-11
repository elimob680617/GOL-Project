import React, { useEffect, useState } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';
import Image from 'src/components/Image';

import { HelpCategoryType } from './HelpSideBar';

function HelpCategoryDetail(props: {
  isCategoryId: string;
  setIsCategoryId: React.Dispatch<React.SetStateAction<string>>;
  setIsArticleId: React.Dispatch<React.SetStateAction<string>>;
  helpCategories: HelpCategoryType[];
}) {
  const { isCategoryId, setIsCategoryId, setIsArticleId, helpCategories } = props;

  const categoryItem = helpCategories?.findIndex((item) => item?.id === isCategoryId);
  const categoryData = helpCategories?.[categoryItem as number];

  const [isSubCategory, setIsSubCategory] = useState<HelpCategoryType | undefined>(categoryData as HelpCategoryType);
  const [getIdSubCategory, setGetIdSubCategory] = useState('');

  console.log('get id', getIdSubCategory);

  // const categoryItemsDataJson = localStorage.getItem('categoryItems');
  // const categoryItemsData = JSON.parse(categoryItemsDataJson as string);

  // const subCategoryItem = helpCategories?.subCategory?.findIndex((item) => item?.id === isSubCategory);
  // const subCategoryData = helpCategories?.subCategory?.[subCategoryItem as number];

  useEffect(() => {
    if (isSubCategory) {
      setIsSubCategory({ ...categoryData?.subCategory?.find((item) => item.id === getIdSubCategory) });
      // setIsCategoryId(categoryData?.id);
    }
  }, [isSubCategory, getIdSubCategory, categoryData?.subCategory]);

  console.log('aaaaaa: ', isSubCategory);
  // console.log('subCategoryItem is:', subCategoryItem);
  // console.log('subCategoryData is:', subCategoryData);
  // console.log('isSubCategory is:', isSubCategory);

  return (
    <Stack sx={{ width: 648, bgcolor: 'background.paper', borderRadius: 1, p: 3, overflowY: 'scroll' }}>
      {/* //--------------------------- Header ---------------------------// */}

      <Stack alignItems="center" sx={{ backgroundColor: 'grey.100', py: 3, borderRadius: 1, mb: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Image src="src/assets/icons/policy,rule,reporting.svg" alt="Policy,Rule,Reporting Icon" />
        </Box>
        <Typography variant="h6" color="text.secondary">
          {categoryData?.title}
        </Typography>
      </Stack>

      {/* //--------------------------- Category Description ---------------------------// */}
      <Box>
        <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
          {categoryData?.description}
        </Typography>
      </Box>
      <Stack spacing={2}>
        {(categoryData?.subCategory?.length as number) > 0
          ? categoryData?.subCategory?.map((sub) => (
              <Stack
                direction="row"
                key={sub?.id}
                justifyContent="space-between"
                onClick={() => setGetIdSubCategory(sub?.id)}
                sx={{ p: 2, border: 1, borderColor: 'background.neutral', borderRadius: 1 }}
              >
                <Typography variant="subtitle2">{sub?.title}</Typography>
                <Icon name="right-arrow-1" />
              </Stack>
            ))
          : categoryData?.articles?.map((article) => (
              <Stack
                direction="row"
                key={article?.id}
                justifyContent="space-between"
                onClick={() => {
                  setIsArticleId(article?.id);
                  setIsCategoryId('');
                }}
                sx={{ p: 2, border: 1, borderColor: 'background.neutral', borderRadius: 1 }}
              >
                <Typography variant="subtitle2">{article?.title}</Typography>
                <Icon name="right-arrow-1" />
              </Stack>
            ))}
      </Stack>
    </Stack>
  );
}

export default HelpCategoryDetail;
