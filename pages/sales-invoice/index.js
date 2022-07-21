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

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { debounce } from 'lodash';

import {
    createSalesInvoice, resetCreateSalesInvError, resetCreateSalesInvLoading, resetCreateSalesInvResp,
    searchSalesInvoice, resetSearchSalesInvLoading, resetSearchSalesInvResp, resetSearchSalesinvError
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
    const handleOpenDetailSo = () => {
        const detailSoUrl = `/sales-order/info/${row.id}`;
        router.push(detailSoUrl)
    }
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
                    {row.soNumber}
                </TableCell>
                <TableCell align="right">{row.soStatus}</TableCell>
                <TableCell align="right">{dateFns.format(new Date(row.soDate), "yyyy-MM-dd")}</TableCell>
                <TableCell align="right">{row.customerName}</TableCell>
                <TableCell align="right">{row.grandDiscount}</TableCell>
                <TableCell align="right">{row.totalAmount}</TableCell>
                <TableCell align="right">{row.grandTotal}</TableCell>
                <TableCell align="right">{row.taxAmount}</TableCell>
                <TableCell align="right">{row.afterTaxAmount}</TableCell>
                <TableCell><Button onClick={handleOpenDetailSo}>Detail So</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography>Detail Sales Order</Typography>
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
    } = useSelector((state) => state.salesInvoice);

    const [searchSiStr, setSearchSiStr] = React.useState('');
    const [filterSiStatus, setFilterSiStatus] = React.useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
            </Box>
            {console.log(searchSalesInvResp)}
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