import { FormattedMessage } from 'react-intl';

import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';

import ReportGardenMessages from '../ReportGarden.message';

interface ExportFilePropType {
  openCollapse: boolean;
  exportFile: string;
  setExportFile: React.Dispatch<React.SetStateAction<string>>;
}

const ExportFile = (props: ExportFilePropType) => {
  const { openCollapse, exportFile, setExportFile } = props;
  return (
    <Stack display={!openCollapse ? 'none' : 'flex'}>
      <Box>
        <Select
          sx={{
            '& .MuiSelect-select': {
              paddingRight: '0px !important',
            },
          }}
          size="small"
          value={exportFile}
          displayEmpty
          onChange={(event) => setExportFile(event.target.value)}
          IconComponent={() => (
            <Stack alignItems="center" justifyContent="center" pr={2}>
              <Icon name="Report" color="grey.500" />
            </Stack>
          )}
          renderValue={
            !exportFile
              ? () => (
                  <Typography variant="button" color="gray.900">
                    <FormattedMessage {...ReportGardenMessages.export} />
                  </Typography>
                )
              : undefined
          }
        >
          <MenuItem value={'CSV'}>CSV</MenuItem>
          <MenuItem value={'Excel'}>Excel</MenuItem>
          <MenuItem value={'PDF'}>PDF</MenuItem>
        </Select>
      </Box>
    </Stack>
  );
};

export default ExportFile;
