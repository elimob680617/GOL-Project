import { MenuItem, Select, Stack, Typography } from '@mui/material';

import { Icon } from 'src/components/Icon';

const ExportFile = ({
  openCollapse,
  exportFile,
  setExportFile,
}: {
  openCollapse?: any;
  exportFile?: any;
  setExportFile?: any;
}) => (
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
              Export
            </Typography>
          )
        : undefined
    }
  >
    <MenuItem value={'CSV'}>CSV</MenuItem>
    <MenuItem value={'Excel'}>Excel</MenuItem>
    <MenuItem value={'PDF'}>PDF</MenuItem>
  </Select>
);

export default ExportFile;
