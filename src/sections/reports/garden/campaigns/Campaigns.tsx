import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Box, Button, Collapse, InputAdornment, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import dayjs from 'dayjs';
import { useLazyGetCampaignsInfoQuery } from 'src/_graphql/history/queries/getCampaignsInfo.generated';
import { Icon } from 'src/components/Icon';

import DateDialog from '../../components/DateDialog';
import GOLPagination from '../../components/GOLPagination';
import ReportGardenMessages from '../ReportGarden.message';
import ExportFile from './ExportFile';

//...
//.............................................................................
const ImageArrowDown = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: 9,
  marginLeft: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));
const ClearAllStyle = styled(Stack)(({ theme }) => ({
  width: 118,
  height: 40,
  color: theme.palette.grey[900],
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
}));
const DateStyle = styled(Stack)(({ theme }) => ({
  height: 40,
  width: 164,
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2.5),
  cursor: 'pointer',
}));
//....................................................................
//type
interface filterDataType {
  search?: string;
  from?: Date;
  to?: Date;
  status?: string;
  sortBy?: string;
  column?: string;
}

interface ICampaignReport {
  id?: string;
  campaignId?: string;
  campaignName?: string;
  campaignStatus?: string;
  campaignTarget?: string;
  receivedMoney?: string;
  raisedFund?: string;
  startDate?: string;
  updateDate?: string;
  endDate?: string;
}
function Campaigns() {
  const { formatMessage } = useIntl();
  const [getCampaignsInfo, { data: campaignInfoData }] = useLazyGetCampaignsInfoQuery();
  //   const router = useRouter();
  //   const theme = useTheme();
  const [openCollapse, setOpenCollapse] = useState(false);
  const [filterData, setFilterData] = React.useState<filterDataType>({
    search: '',
    from: undefined,
    to: undefined,
    status: '',
    sortBy: '',
    column: '',
  });
  const initialData = {
    search: '',
    from: undefined,
    to: undefined,
    status: '',
    sortBy: '',
    column: '',
  };
  const [exportFile, setExportFile] = useState('');
  const [rows, setRows] = useState<ICampaignReport[]>([]);
  console.log(rows);
  const [page, setPage] = useState<number>(0);
  const [orderByFields, setOrderByFields] = useState<string[]>([]);
  const [isFromDateDialog, setIsFromDateDialog] = useState(false);
  const [isToDateDialog, setIsToDateDialog] = useState(false);
  const [filter, setFilter] = useState<filterDataType>({});
  //...........................................
  const handleClickCollapse = () => {
    setOpenCollapse(!openCollapse);
  };
  //...............................................................................................................
  //service
  useEffect(() => {
    getCampaignsInfo({
      filter: {
        pageSize: 5,
        pageIndex: 1,
        orderByFields,
      },
    });
  }, [getCampaignsInfo, orderByFields]);
  useEffect(() => {
    if (campaignInfoData?.getCampaignsInfo.listDto?.items) {
      let campaignReports: ICampaignReport[] = [];
      campaignReports = campaignInfoData?.getCampaignsInfo?.listDto?.items.map((campaignReport: any, index: any) => {
        const returned: ICampaignReport = {
          id: index,
          campaignId: campaignReport?.ownerUserId || undefined,
          campaignName: campaignReport?.campaignName || '-',
          campaignStatus: campaignReport?.campaignStatus || '-',
          campaignTarget: campaignReport?.target,
          raisedFund: campaignReport?.raisedFund,
          startDate: dayjs(campaignReport?.startDate).format('YYYY-MM-DD'),
          endDate: dayjs(campaignReport?.endDate).format('YYYY-MM-DD'),
          updateDate: dayjs(campaignReport?.updateDate).format('YYYY-MM-DD'),
          receivedMoney: campaignReport?.raisedFund,
        };

        return returned;
      });
      setRows(campaignReports);
    }
  }, [campaignInfoData]);

  const handleFilter = (filterSet: filterDataType) => {
    let filterExpression = '';
    if (filterSet.status) {
      filterExpression += `CampaignStatus==\\"${filterSet.status}\\"`;
    }
    if (filterSet.search) {
      if (filterExpression) {
        filterExpression += '&&';
      }
      filterExpression += `CampaignName.Contains(\\"${filterSet.search}\\")`;
    }
    if (filterSet.from) {
      if (filterExpression) {
        filterExpression += '&&';
      }
      filterExpression += `startDate >= DateTimeOffset.Parse(\\"${dayjs(filterSet.from).format(
        'YYYY-MM-DD',
      )}\\").UtcDateTime`;
    }
    if (filterSet.to) {
      if (filterExpression) {
        filterExpression += '&&';
      }
      filterExpression += `endDate <= DateTimeOffset.Parse(\\"${dayjs(filterSet.to).format(
        'YYYY-MM-DD',
      )}\\").UtcDateTime`;
    }
    return filterExpression;
  };

  const apply = (filterSet?: filterDataType) => {
    const filterObject = filterSet || filterData;
    setFilter(filterObject);
    getCampaignsInfo({
      filter: {
        pageSize: 5,
        pageIndex: 1,
        orderByFields: orderByFields,
        orderByDescendings: [false],
        filterExpression: handleFilter(filterObject),
      },
    });
  };

  const clearAll = () => {
    setFilterData(initialData);
    apply(initialData);
  };

  const pageChange = (newPage: number) => {
    setPage(newPage);
    getCampaignsInfo({
      filter: {
        pageSize: 5,
        pageIndex: newPage,
        orderByFields,
        filterExpression: handleFilter(filter),
      },
    });
  };
  //............................................................DataGrid

  // const columns: GridColDef[] = [
  //   {
  //     field: 'campaignName',
  //     headerName: formatMessage(ReportGardenMessages.campaignTarget),
  //     width: 141,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
  //   },

  //   {
  //     field: 'campaignStatus',
  //     headerName: formatMessage(ReportGardenMessages.status),
  //     width: 141,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => (
  //       <Stack
  //         alignItems={'center'}
  //         justifyContent={'center'}
  //         sx={{
  //           py: 0.5,
  //           ...(cellValues.value === 'Successful'
  //             ? { bgcolor: '#28BF64', color: '#fff' }
  //             : cellValues.value === 'Finished'
  //             ? { bgcolor: '#2092E4', color: '#fff' }
  //             : cellValues.value === 'Interrupted'
  //             ? { bgcolor: '#D27722', color: '#fff' }
  //             : { bgcolor: '#13968E', color: '#fff' }),
  //           width: 102,
  //           borderRadius: 1,
  //         }}
  //       >
  //         <Typography variant="caption">{cellValues.value}</Typography>
  //       </Stack>
  //     ),
  //   },
  //   {
  //     field: 'campaignTarget',
  //     headerName: formatMessage(ReportGardenMessages.campaignTarget),
  //     type: 'number',
  //     width: 141,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => <Typography variant="body2">${cellValues.value}</Typography>,
  //   },
  //   {
  //     field: 'receivedMoney',
  //     headerName: formatMessage(ReportGardenMessages.receivedMoney),
  //     sortable: false,
  //     width: 141,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => <Typography variant="body2">${cellValues.value}</Typography>,
  //     // valueGetter: (params: GridValueGetterParams) => `${params.row.CampaignName || ''} ${params.row.NGOName || ''}`,
  //   },
  //   {
  //     field: 'raisedFund',
  //     headerName: formatMessage(ReportGardenMessages.raisedFund),
  //     sortable: false,
  //     width: 141,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => <Typography variant="body2">${cellValues.value}</Typography>,
  //     // valueGetter: (params: GridValueGetterParams) => `${params.row.CampaignName || ''} ${params.row.NGOName || ''}`,
  //   },
  //   {
  //     field: 'startDate',
  //     headerName: formatMessage(ReportGardenMessages.startDate),
  //     sortable: false,
  //     width: 141,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
  //   },
  //   {
  //     field: 'updateDate',
  //     headerName: formatMessage(ReportGardenMessages.updateDate),
  //     sortable: false,
  //     width: 140,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
  //   },
  //   {
  //     field: 'endDate',
  //     headerName: formatMessage(ReportGardenMessages.endDate),
  //     sortable: false,
  //     width: 140,
  //     align: 'center',
  //     headerAlign: 'center',
  //     renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
  //   },
  // ];
  //.............................................................................
  return (
    <>
      <Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={2}>
          <Stack direction="row">
            <Typography variant="subtitle1" color="primary.dark">
              <FormattedMessage {...ReportGardenMessages.campaignsData} />
            </Typography>
            <ImageArrowDown onClick={handleClickCollapse}>
              {openCollapse ? <Icon name="upper-arrow" /> : <Icon name="down-arrow" />}
            </ImageArrowDown>
          </Stack>
          <ExportFile openCollapse={openCollapse} exportFile={exportFile} setExportFile={setExportFile} />
        </Stack>
        {/*............................................................................*/}
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
          {/*------------------------->>>Filter*/}
          {/*...search */}
          <Stack mt={3} mb={2} direction="row" alignItems="center" gap={2} px={2}>
            <Stack direction="row" spacing={2} sx={{ width: 164 }}>
              <TextField
                onChange={(e) => setFilterData((prev) => ({ ...prev, search: e.target.value as string }))}
                value={filterData.search}
                size="small"
                name="search"
                type="text"
                placeholder={formatMessage(ReportGardenMessages.nameOrTitle)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Icon name="Research" color="grey.500" type="solid" />
                    </InputAdornment>
                  ),
                }}
              />
            </Stack>
            {/*...from */}
            <DateStyle
              direction="row"
              spacing={2}
              onClick={() => {
                setIsFromDateDialog(true);
              }}
            >
              {!filterData.from ? (
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage {...ReportGardenMessages.from} />
                </Typography>
              ) : (
                <Typography variant="body2" color="text.primary">
                  {filterData.from ? dayjs(filterData.from).format('YYYY-MM-DD') : ''}
                </Typography>
              )}

              <Icon name="calendar" type="linear" color="grey.500" />
            </DateStyle>
            {/*...to */}

            <DateStyle
              direction="row"
              spacing={2}
              onClick={() => {
                setIsToDateDialog(true);
              }}
            >
              {!filterData.to ? (
                <Typography variant="body2" color="text.secondary">
                  <FormattedMessage {...ReportGardenMessages.to} />
                </Typography>
              ) : (
                <Typography variant="body2" color="text.primary">
                  {filterData.to ? dayjs(filterData.to).format('YYYY-MM-DD') : ''}
                </Typography>
              )}

              <Icon name="calendar" type="linear" color="grey.500" />
            </DateStyle>
            {/*...status */}
            <Stack>
              <Box>
                <Select
                  sx={{ width: 107 }}
                  size="small"
                  value={filterData.status}
                  displayEmpty
                  onChange={(e) => setFilterData((prev) => ({ ...prev, status: e.target.value as string }))}
                  renderValue={
                    !filterData.status
                      ? () => (
                          <Typography variant="button" color="text.secondary">
                            <FormattedMessage {...ReportGardenMessages.status} />
                          </Typography>
                        )
                      : undefined
                  }
                >
                  <MenuItem value={'Active'}>
                    <FormattedMessage {...ReportGardenMessages.active} />
                  </MenuItem>
                  <MenuItem value={'Interrupted'}>
                    <FormattedMessage {...ReportGardenMessages.interrupted} />
                  </MenuItem>
                  <MenuItem value={'Finished'}>
                    <FormattedMessage {...ReportGardenMessages.finished} />
                  </MenuItem>
                  <MenuItem value={'Successful'}>
                    <FormattedMessage {...ReportGardenMessages.successful} />
                  </MenuItem>
                </Select>
              </Box>
            </Stack>
            {/*... Sort By*/}
            <Stack>
              <Box>
                <Select
                  sx={{ width: 107 }}
                  size="small"
                  value={filterData.sortBy}
                  displayEmpty
                  onChange={(e) => {
                    setFilterData((prev) => ({ ...prev, sortBy: e.target.value as string }));
                    setOrderByFields([e.target.value as string]);
                  }}
                  renderValue={
                    !filterData.sortBy
                      ? () => (
                          <Typography variant="button" color="text.secondary">
                            <FormattedMessage {...ReportGardenMessages.sortBy} />
                          </Typography>
                        )
                      : undefined
                  }
                >
                  <MenuItem value={'campaignName'}>
                    <FormattedMessage {...ReportGardenMessages.campaignName} />
                  </MenuItem>
                  <MenuItem value={'campaignStatus'}>
                    <FormattedMessage {...ReportGardenMessages.status} />
                  </MenuItem>
                  <MenuItem value={'target'}>
                    <FormattedMessage {...ReportGardenMessages.campaignTarget} />
                  </MenuItem>
                  <MenuItem value={'raisedFund'}>
                    <FormattedMessage {...ReportGardenMessages.raisedFund} />
                  </MenuItem>
                  <MenuItem value={'updateDate'}>
                    <FormattedMessage {...ReportGardenMessages.updateDate} />
                  </MenuItem>
                </Select>
              </Box>
            </Stack>
            {/*...column  */}
            <Stack>
              <Box>
                <Select
                  sx={{ width: 107 }}
                  size="small"
                  value={filterData.column}
                  displayEmpty
                  onChange={(e) => setFilterData((prev) => ({ ...prev, column: e.target.value as string }))}
                  renderValue={
                    !filterData.column
                      ? () => (
                          <Typography variant="button" color="text.secondary">
                            Column
                          </Typography>
                        )
                      : undefined
                  }
                >
                  <MenuItem value={'1'}>
                    <FormattedMessage {...ReportGardenMessages.receivedMoney} />
                  </MenuItem>
                  <MenuItem value={'2'}>
                    <FormattedMessage {...ReportGardenMessages.raisedFund} />
                  </MenuItem>
                  <MenuItem value={'3'}>
                    <FormattedMessage {...ReportGardenMessages.donors} />
                  </MenuItem>
                </Select>
              </Box>
            </Stack>
            {/*...clearAll  */}
            <ClearAllStyle onClick={clearAll} alignItems="center" justifyContent="center">
              <Stack direction="row" alignItems="center" justifyContent="center" p={0}>
                <Stack>
                  <Icon name="Close" color="grey.500" />
                </Stack>
                <Typography color="text.secondary" variant="button">
                  <FormattedMessage {...ReportGardenMessages.clearAll} />
                </Typography>
              </Stack>
            </ClearAllStyle>
            {/*...Apply*/}

            <Button
              sx={{
                '&.Mui-disabled': {
                  backgroundColor: 'primary.main',
                  opacity: 0.3,
                },
              }}
              variant="contained"
              disabled={
                filterData.column === '' &&
                filterData.status === '' &&
                filterData.search === '' &&
                filterData.sortBy === '' &&
                filterData.from === undefined &&
                filterData.to === undefined
              }
              onClick={() => apply()}
            >
              <Typography color="common.white">
                <FormattedMessage {...ReportGardenMessages.apply} />
              </Typography>
            </Button>
          </Stack>
          <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 16, ml: -2 }} />
          {/*...DataGrid */}
          <Stack mt={5}>
            <Box style={{ height: 450, width: '100%', position: 'relative' }}>
              {/* <DataGrid rows={rows} columns={columns} disableSelectionOnClick disableColumnMenu hideFooter /> */}
              {/* Pagination */}
              <Stack sx={{ position: 'absolute', p: 1.5, bottom: 0, right: 0 }}>
                <GOLPagination
                  totalText={`Total: ${campaignInfoData?.getCampaignsInfo?.listDto?.count} campaigns, Raised Fund: ${campaignInfoData?.getCampaignsInfo?.listDto?.items?.[0]?.raisedFund}`}
                  currentPage={page}
                  pageChange={pageChange}
                  count={Math.round(campaignInfoData?.getCampaignsInfo?.listDto?.count / 5)}
                />
              </Stack>
            </Box>
            {/* <NoResult /> */}
          </Stack>
        </Collapse>
      </Stack>
      <DateDialog
        value={filterData?.from || null}
        open={isFromDateDialog}
        onClose={(date) => {
          setIsFromDateDialog(false);
          if (date instanceof Date) {
            setFilterData((prev) => ({ ...prev, from: date }));
          }
        }}
        isFromDate={true}
      />
      <DateDialog
        minDate={filterData?.from || null}
        value={filterData?.to || null}
        open={isToDateDialog}
        onClose={(date) => {
          setIsToDateDialog(false);
          if (date instanceof Date) {
            setFilterData((prev) => ({ ...prev, to: date }));
          }
        }}
        isFromDate={false}
      />
    </>
  );
}

export default Campaigns;
