import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Link from 'next/link';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { debounce } from 'lodash';

import {
    createSalesInvoice, resetCreateSalesInvError, resetCreateSalesInvLoading, resetCreateSalesInvResp,
    searchSalesInvoice, resetSearchSalesInvLoading, resetSearchSalesInvResp, resetSearchSalesinvError,
    createIncomingPayment, resetCreateIncomingPaymentError, resetCreateIncomingPaymentLoading, resetCreateIncomingPaymentResp,
    setSelectedSalesInvoice
} from '../../src/redux/slices/sales-invoice-slice';

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 300,
        },
    },
};

function Row(props) {
    const { row } = props;
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const handleCreateIncomingPayment = (row) => {

        const detailSalesInvoice = `/sales-invoice/detail/${row.id}`;
        router.push(detailSalesInvoice);
    }
    const dispatch = useDispatch();

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Link href={`/sales-order/info/${row.soId}`}>{row.soNumber}</Link>
                </TableCell>
                <TableCell>{row.invNumber}</TableCell>
                <TableCell><Chip label={row.invStatus} color='primary'/></TableCell>
                <TableCell>{row.invoiceDate != null ? dateFns.format(new Date(row.invoiceDate), "yyyy-MM-dd") : ''}</TableCell>
                <TableCell>{dateFns.format(new Date(row.paymentDueDate), "yyyy-MM-dd")}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.customerPhone}</TableCell>
                <TableCell>{row.invoiceAmount}</TableCell>
                <TableCell>{row.paidAmount}</TableCell>
                <TableCell>{row.unpaidAmount}</TableCell>

                <TableCell><Button onClick={() => handleCreateIncomingPayment(row)}>Incoming Payment</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1, padding: 1 }} border={1} borderRadius={1} borderColor="#cccccc">
                            <Typography fontWeight={600} fontSize={16}>Detail Payment</Typography>
                            <TableContainer>
                                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Inc. Payment No.</TableCell>
                                            <TableCell>Inc. Payment Date</TableCell>
                                            <TableCell>Payment Amount</TableCell>
                                            <TableCell>Payment method</TableCell>
                                            <TableCell>Cust. Bank</TableCell>
                                            <TableCell>Receive. Bank</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    {row.incomingPayments &&
                                        <TableBody>
                                            {(row.incomingPayments.length > 0) ? row.incomingPayments.map(ip => (
                                                <TableRow key={ip.id}>
                                                    <TableCell>{ip.ipNumber}</TableCell>
                                                    <TableCell>{dateFns.format(new Date(ip.ipDate), "yyyy-MM-dd")}</TableCell>
                                                    <TableCell>{ip.paymentAmount}</TableCell>
                                                    <TableCell>{ip.paymentMethod}</TableCell>
                                                    {ip.paymentMethod == "TRANSFER" ? <><TableCell sx={{
                                                        fontSize: 12
                                                    }}>{`${ip.custBankAccountName}-${ip.custBankName}-${ip.custBankAccountNo}`}</TableCell>
                                                        <TableCell sx={{
                                                            fontSize: 12
                                                        }}>{`${ip.ownerBankAccountName}-${ip.ownerBankName}-${ip.ownerBankAccountNo}`}</TableCell></>
                                                        : <>
                                                            <TableCell></TableCell><TableCell></TableCell>
                                                        </>}
                                                </TableRow>
                                            )) :
                                                <TableRow><TableCell colSpan={4} align='center'><Typography>Incoming payment is empty</Typography></TableCell></TableRow>}
                                        </TableBody>}
                                </Table>
                            </TableContainer>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const Index = ({ session }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        createSalesInvLoading,
        createSalesInvResp,
        createSalesInvError,
        searchSalesInvLoading,
        searchSalesInvResp,
        searchSalesInvError,
        selectedSalesInvoice,
    } = useSelector((state) => state.salesInvoice);

    const [searchSiStr, setSearchSiStr] = React.useState('');
    const [filterSiStatus, setFilterSiStatus] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openIncomingPaymentForm, setOpenIncomingPaymentForm] = React.useState(false);

    React.useEffect(() => {
        if (selectedSalesInvoice == null) {
            setOpenIncomingPaymentForm(false);
        } else {
            setOpenIncomingPaymentForm(true);
        }
    }, [selectedSalesInvoice]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    React.useEffect(() => {
        dispatch(searchSalesInvoice({ searchStr: searchSiStr, invoiceStatus: filterSiStatus, page: page, size: rowsPerPage, token: session.accessToken }))
        return () => {
            dispatch(resetSearchSalesInvResp());
        };
    }, [searchSiStr, filterSiStatus, page, rowsPerPage, session]);

    const handleSearchSalesInv = (evt) => {
        setSearchSiStr(evt.target.value);
    }

    const debouncedSearchSI = React.useMemo(() => debounce(handleSearchSalesInv, 300), []);
    const handleSelectSiStatus = (evt) => {
        setFilterSiStatus(evt.target.value);
    }

    const handleOpenCreateSalesInvoice = () => {
        router.push('/sales-invoice/create-inv');
    }
    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>

            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Sales Invoices</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1
            }}>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <Box>
                        <TextField sx={{
                            width: 400,
                        }} label="Search" variant='outlined' size='small' onChange={debouncedSearchSI} />
                    </Box>
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>SI Status</InputLabel>
                        <Select
                            value={filterSiStatus}
                            label="Si Status"
                            onChange={handleSelectSiStatus}
                            size='small'>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="DRAFT">Draft</MenuItem>
                            <MenuItem value="UNPAID">Unpaid</MenuItem>
                            <MenuItem value="PARTIAL">Partial</MenuItem>
                            <MenuItem value="PAID">Close</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {/* <Button type='button' variant='contained' onClick={handleOpenCreateSalesInvoice}>Create Invoice</Button> */}
            </Box>
            <Box>
                <TableContainer>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right"></TableCell>
                                <TableCell>SO Number</TableCell>
                                <TableCell>Inv Number</TableCell>
                                <TableCell>Inv Status</TableCell>
                                <TableCell>Inv Create Date</TableCell>
                                <TableCell>Inv Due Date</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Customer Phone</TableCell>
                                <TableCell>Inv Amount</TableCell>
                                <TableCell>Paid Amount</TableCell>
                                <TableCell>Unpaid Amount</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        {searchSalesInvResp &&
                            <TableBody>
                                {console.log(searchSalesInvResp)}
                                {(searchSalesInvResp.data.length > 0) ? searchSalesInvResp.data.map(row => (
                                    <Row key={row?.id} row={row} />
                                )) :
                                    <TableRow><TableCell colSpan={11} align='center'><Typography>Sales invoice is empty</Typography></TableCell></TableRow>}
                            </TableBody>}
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                    colSpan={11}
                                    count={searchSalesInvResp?.totalRecords == undefined ? 0 : searchSalesInvResp?.totalRecords}
                                    rowsPerPage={rowsPerPage}
                                    page={searchSalesInvResp?.totalRecords == undefined ? 0 : page}
                                    SelectProps={{
                                        inputProps: {
                                            'aria-label': 'rows per page',
                                        },
                                        native: true,
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>

        </Box>);
}

Index.getLayout = function getLayout(page) {
    return (
        <DashboardLayout>{page}</DashboardLayout>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    if (!session) {
        return {
            redirect: {
                destination: '/auth/signin',
                permanent: false,
            }
        };
    }

    return {
        props: { session }
    }
}

export default Index;