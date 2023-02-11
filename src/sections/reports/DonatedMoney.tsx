import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

//mui
import {
  Box,
  Button,
  Collapse,
  Container,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

//component
import dayjs from 'dayjs';
import { useLazyGetDonatedReportQueryQuery } from 'src/_graphql/history/queries/getDonatedReport.generated';
import { Icon } from 'src/components/Icon';
//icon
// import { RHFTextField } from 'src/components/hook-form';
import useAuth from 'src/hooks/useAuth';
import DateDialog from 'src/sections/reports/components/DateDialog';
import { UserTypeEnum } from 'src/types/serverTypes';

import DonatedMoneyMessages from './DonatedMoney.messages';
import ExportFile from './components/ExportFile';
import GOLPagination from './components/GOLPagination';

// import NoResult from '../components/NoResult';
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
const ClearAllStyle = styled(Button)(({ theme }) => ({
  width: 118,
  height: 40,
  color: theme.palette.grey[900],
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.palette.grey[300],
  borderRadius: theme.spacing(1),
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

//...............................................................................................................
//type
interface filterDataType {
  search?: string;
  from?: Date;
  to?: Date;
  status?: string;
  sortBy?: string;
  column?: string;
}
interface IDonatedReport {
  id?: number;
  campaignName?: string;
  campaignStatus?: string;
  ngoName?: string;
  raisedFund?: string;
  raisedFundDateTime?: string;
}
function DonatedMoney() {
  const back = useNavigate();
  const { user } = useAuth();
  const { formatMessage } = useIntl();
  const [openCollapse, setOpenCollapse] = useState(false);
  const initialData = {
    search: '',
    from: undefined,
    to: undefined,
    status: '',
    sortBy: '',
    column: '',
  };
  const [filterData, setFilterData] = React.useState<filterDataType>({
    search: '',
    from: undefined,
    to: undefined,
    status: '',
    sortBy: '',
    column: '',
  });

  const [isFromDateDialog, setIsFromDateDialog] = useState(false);
  const [isToDateDialog, setIsToDateDialog] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<IDonatedReport[]>([]);
  const [getDonateReport, { data: donateReportData }] = useLazyGetDonatedReportQueryQuery();
  const donatedReportsRows = donateReportData?.getDonatedReportQuery.listDto?.items;
  const [orderByFields, setOrderByFields] = useState<string[]>([]);
  const [filter, setFilter] = useState<filterDataType>({});
  //....................................................................

  //...............................................................................................................
  //service

  useEffect(() => {
    getDonateReport({
      filter: {
        pageSize: 6,
        pageIndex: 1,
        orderByFields,
        // filterExpression: `NgoId == (\"${donatedReportRows?.ownerUserId}\")`,
        dto: { id: user?.id },
      },
    });
  }, [getDonateReport, orderByFields, user?.id]);

  useEffect(() => {
    if (donatedReportsRows) {
      let donatedReports: IDonatedReport[] = [];
      donatedReports = donatedReportsRows?.map((donateReport: any, index: number) => {
        const returned: IDonatedReport = {
          id: index,
          campaignName: donateReport?.campaignName || '-',
          raisedFund: donateReport?.raisedFund,
          campaignStatus: donateReport?.campaignStatus || '-',
          ngoName: donateReport?.ngoName || '-',
          raisedFundDateTime: dayjs(donateReport?.raisedFundDateTime).format('YYYY-MM-DD'),
        };

        return returned;
      });
      setRows(donatedReports);
    }
  }, [donateReportData, donatedReportsRows]);

  const handleFilter = (filterSet: filterDataType) => {
    let filterExpression = '';
    if (filterSet.status) {
      filterExpression += `${filterExpression.length ? '&&' : ''} CampaignStatus==\"${filterSet.status}\"`;
    }
    if (filterSet.search) {
      filterExpression += `${filterExpression.length ? '&&' : ''} CampaignName.Contains(\"${filterSet.search}\")`;
    }
    if (filterSet.from) {
      filterExpression += `${filterExpression.length ? '&&' : ''} startDate >= DateTimeOffset.Parse(\"${dayjs(
        filterSet.from,
      ).format('YYYY-MM-DD')}\").UtcDateTime`;
    }
    if (filterSet.to) {
      filterExpression += `${filterExpression.length ? '&&' : ''} endDate <= DateTimeOffset.Parse(\"${dayjs(
        filterSet.to,
      ).format('YYYY-MM-DD')}\").UtcDateTime`;
    }
    return filterExpression;
  };

  const apply = (filterSet?: filterDataType) => {
    const filterObject = filterSet || filterData;
    setFilter(filterObject);
    getDonateReport({
      filter: {
        pageSize: 6,
        pageIndex: 1,
        orderByFields,
        orderByDescendings: [false],
        filterExpression: handleFilter(filterObject),
      },
    });
  };

  const clearAll = () => {
    setFilterData(initialData);
    apply(initialData);
    setOrderByFields([]);
  };
  const pageChange = (newPage: number) => {
    setPage(newPage);
    getDonateReport({
      filter: {
        pageSize: 6,
        pageIndex: newPage,
        orderByFields,
        orderByDescendings: [false],
        filterExpression: handleFilter(filter),
      },
    });
  };
  //...........................................
  const handleClickCollapse = () => {
    setOpenCollapse(!openCollapse);
  };

  //............../
  //............................................................DataGrid

  const columns: GridColDef[] = [
    {
      field: 'campaignName',
      headerName: formatMessage(DonatedMoneyMessages.campaignName),
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => (
        <Typography
          variant="body2"
          sx={{
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'pre-wrap',
            textAlign: 'center',
          }}
        >
          {cellValues.value}
        </Typography>
      ),
    },
    {
      field: 'ngoName',
      headerName: formatMessage(DonatedMoneyMessages.ngoName),
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
    {
      field: 'campaignStatus',
      headerName: `${formatMessage(DonatedMoneyMessages.campaignStatus)}`,
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          sx={{
            py: 0.5,
            ...(cellValues.value === 'SUCCESSFUL'
              ? { bgcolor: '#28BF64', color: '#fff' }
              : cellValues.value === 'FINISHED'
              ? { bgcolor: '#2092E4', color: '#fff' }
              : cellValues.value === 'INTERRUPTED'
              ? { bgcolor: '#D27722', color: '#fff' }
              : { bgcolor: '#13968E', color: '#fff' }),
            width: 102,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption">{cellValues.value}</Typography>
        </Stack>
      ),
    },
    {
      field: 'donatedMoney',
      headerName: formatMessage(DonatedMoneyMessages.donatedMoney),
      sortable: false,
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">${cellValues.value.toLocaleString()}</Typography>,
      // valueGetter: (params: GridValueGetterParams) => `${params.row.CampaignName || ''} ${params.row.NGOName || ''}`,
    },
    {
      field: 'payDate',
      headerName: formatMessage(DonatedMoneyMessages.payDate),
      sortable: false,
      width: 224,
      align: 'center',
      headerAlign: 'center',
      renderCell: (cellValues) => <Typography variant="body2">{cellValues.value}</Typography>,
    },
  ];

  //.............................................................................
  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.neutral', minHeight: '100vh' }}>
        <Container maxWidth="lg" sx={{ p: '0px !important' }}>
          <Stack spacing={3} pb={3}>
            <Stack
              direction="row"
              spacing={3}
              px={4}
              py={2}
              sx={{ bgcolor: 'background.paper', borderRadius: 1, mt: 5 }}
            >
              <Box sx={{ cursor: 'pointer' }} onClick={() => back(-1)}>
                <Icon name="left-arrow" color="grey.500" />
              </Box>

              <Typography variant="body1" color="text.primary">
                {user?.userType === UserTypeEnum.Normal
                  ? formatMessage(DonatedMoneyMessages.reportNormalUser)
                  : formatMessage(DonatedMoneyMessages.myDonation)}
              </Typography>
            </Stack>

            <>
              <Stack sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={2}>
                  <Stack direction="row">
                    <Typography variant="subtitle1" color="primary.dark">
                      <FormattedMessage {...DonatedMoneyMessages.donatedMoney} />
                    </Typography>

                    <ImageArrowDown onClick={handleClickCollapse}>
                      {openCollapse ? (
                        <Icon name="upper-arrow" color="grey.500" />
                      ) : (
                        <Icon name="down-arrow" color="grey.500" />
                      )}
                    </ImageArrowDown>
                  </Stack>
                  <Stack display={!openCollapse ? 'none' : 'flex'}>
                    <Box>
                      <ExportFile />
                    </Box>
                  </Stack>
                </Stack>
                {/*............................................................................*/}
                <Collapse in={openCollapse} timeout="auto" unmountOnExit>
                  {/*------------------------->>>Filter*/}
                  {/*...search */}
                  <Stack mt={3} mb={2} direction="row" alignItems="center" gap={2} px={2}>
                    <Stack direction="row" spacing={2} sx={{ width: 164 }}>
                      {/* <RHFTextField
                        onChange={(e) => setFilterData((prev) => ({ ...prev, search: e.target.value as string }))}
                        value={filterData.search}
                        size="small"
                        name="search"
                        type="text"
                        placeholder={formatMessage(DonatedMoneyMessages.nameOrTitle)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon name="Research" color="grey.500" type="solid" />
                            </InputAdornment>
                          ),
                        }}
                      /> */}
                      <TextField
                        onChange={(e) => setFilterData((prev) => ({ ...prev, search: e.target.value as string }))}
                        value={filterData.search}
                        size="small"
                        name="search"
                        type="text"
                        placeholder={formatMessage(DonatedMoneyMessages.nameOrTitle)}
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
                          <FormattedMessage {...DonatedMoneyMessages.from} />:
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
                          <FormattedMessage {...DonatedMoneyMessages.to} />:
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
                                    <FormattedMessage {...DonatedMoneyMessages.status} />
                                  </Typography>
                                )
                              : undefined
                          }
                        >
                          <MenuItem value={'Active'}>
                            <FormattedMessage {...DonatedMoneyMessages.active} />
                          </MenuItem>
                          <MenuItem value={'Interrupted'}>
                            <FormattedMessage {...DonatedMoneyMessages.interrupted} />
                          </MenuItem>
                          <MenuItem value={'Finished'}>
                            <FormattedMessage {...DonatedMoneyMessages.finished} />
                          </MenuItem>
                          <MenuItem value={'Successful'}>
                            <FormattedMessage {...DonatedMoneyMessages.successful} />
                          </MenuItem>
                        </Select>
                      </Box>
                    </Stack>
                    {/*...start by */}
                    <Stack>
                      <Box>
                        <Select
                          sx={{ width: 107 }}
                          size="small"
                          value={orderByFields[0]}
                          displayEmpty
                          onChange={(e) => setOrderByFields([e.target.value as string])}
                          renderValue={
                            !orderByFields[0]
                              ? () => (
                                  <Typography variant="button" color="text.secondary">
                                    <FormattedMessage {...DonatedMoneyMessages.sortBy} />
                                  </Typography>
                                )
                              : undefined
                          }
                        >
                          <MenuItem value={'campaignName'}>
                            <FormattedMessage {...DonatedMoneyMessages.campaignName} />
                          </MenuItem>
                          <MenuItem value={'campaignStatus'}>
                            <FormattedMessage {...DonatedMoneyMessages.status} />
                          </MenuItem>
                          <MenuItem value={'target'}>
                            <FormattedMessage {...DonatedMoneyMessages.campaignTarget} />
                          </MenuItem>
                          <MenuItem value={'raisedFund'}>
                            <FormattedMessage {...DonatedMoneyMessages.raisedFund} />
                          </MenuItem>
                          <MenuItem value={'updateDate'}>
                            <FormattedMessage {...DonatedMoneyMessages.updateDate} />
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
                                    Column <FormattedMessage {...DonatedMoneyMessages.column} />
                                  </Typography>
                                )
                              : undefined
                          }
                        >
                          <MenuItem value={'1'}>
                            <FormattedMessage {...DonatedMoneyMessages.receivedMoney} />
                          </MenuItem>
                          <MenuItem value={'2'}>
                            <FormattedMessage {...DonatedMoneyMessages.raisedFund} />
                          </MenuItem>
                          <MenuItem value={'3'}>
                            <FormattedMessage {...DonatedMoneyMessages.donors} />
                          </MenuItem>
                        </Select>
                      </Box>
                    </Stack>
                    {/*...clearAll  */}
                    <ClearAllStyle onClick={clearAll}>
                      <Stack mr={1}>
                        <Icon name="Close" color="grey.500" />
                      </Stack>
                      <Stack direction="row" alignItems="center" justifyContent="center" p={0}>
                        <Typography color="text.secondary" variant="button">
                          <FormattedMessage {...DonatedMoneyMessages.clearAll} />
                        </Typography>
                      </Stack>
                    </ClearAllStyle>
                    {/*...Apply*/}
                    <Button variant="contained" onClick={() => apply()}>
                      <FormattedMessage {...DonatedMoneyMessages.apply} />
                    </Button>
                  </Stack>
                  <Box sx={{ width: 'calc(100% + 32px)', bgcolor: 'background.neutral', height: 8, ml: -2 }} />
                  {/*...DataGridPro */}
                  <Stack>
                    <Box style={{ height: 430, width: '100%', position: 'relative' }}>
                      <DataGrid rows={rows} columns={columns} disableSelectionOnClick disableColumnMenu hideFooter />
                      {/* Pagination */}
                      <Stack sx={{ position: 'absolute', p: 1.5, bottom: 0, right: 0 }}>
                        <GOLPagination
                          totalText={`${formatMessage(DonatedMoneyMessages.total)}: ${
                            donateReportData?.getDonatedReportQuery?.listDto?.count
                          } ${formatMessage(DonatedMoneyMessages.campaigns)}, ${
                            donateReportData?.getDonatedReportQuery?.listDto?.items?.[0]?.raisedFund
                          }`}
                          currentPage={page}
                          pageChange={pageChange}
                          count={Math.round(donateReportData?.getDonatedReportQuery?.listDto?.count / 5)}
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
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default DonatedMoney;
