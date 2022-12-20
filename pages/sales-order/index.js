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

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { debounce } from 'lodash';
import {
    createSODraft,
    resetCreateSODraftError,
    resetCreateSODraftLoading,
    resetCreateSODraftResp,
    resetSearchSalesOrderError,
    resetSearchSalesOrderLoading,
    resetSearchSalesOrderResp,
    resetUpdateSODraftToOpenError,
    resetUpdateSODraftToOpenLoading,
    resetUpdateSODraftToOpenResp,
    searchSalesOrder,
    updateSODraftToOpen
} from '../../src/redux/slices/sales-order-slice';
import {
    createCustomer, resetCreateCustomerError, resetCreateCustomerLoading, resetCreateCustomerResp,
    resetSearchCustomerError, resetSearchCustomerLoading, resetSearchCustomerResp, resetUpdateCustomerError,
    resetUpdateCustomerLoading, resetUpdateCustomerResp, searchCustomer, updateCustomer
} from '../../src/redux/slices/customer-slice';
import { route } from 'next/dist/server/router';

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
                {/* <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell> */}
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
            {/* <TableRow>
                <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography>Detail Sales Order</Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow> */}
        </React.Fragment>
    );
}

const Index = ({ session }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        createSODraftLoading,
        createSODraftResp,
        createSODraftError,
        updateSODraftToOpenLoading,
        updateSODraftToOpenResp,
        updateSODraftToOpenError,
        searchSalesOrderLoading,
        searchSalesOrderResp,
        searchSalesOrderError,
    } = useSelector((state) => state.salesOrder);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchSO, setSearchSO] = React.useState('');

    React.useEffect(() => {
        dispatch(searchSalesOrder({ page: page, size: rowsPerPage, searchStr: searchSO, token: session.accessToken }));
    }, [page, rowsPerPage, searchSO, session]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearchSO = (evt) => {
        setSearchSO(evt.target.value);
    }
    const debouncedSearchSO = React.useMemo(() => debounce(handleSearchSO, 300), []);
    const handleOpenCreateSalesOrder = () => {
        router.push('/sales-order/create-so');
    }
    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Sales Orders</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 1
            }}>
                <Box>
                    <TextField sx={{
                        width: 400,
                    }} label="Search" variant='outlined' size='small' onChange={debouncedSearchSO} />
                </Box>
                <Box>
                    <Button type='button' variant='contained' onClick={() => handleOpenCreateSalesOrder()}>Create Sales Order</Button>
                </Box>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell align="right"></TableCell> */}
                            <TableCell>SO Number</TableCell>
                            <TableCell align="right">SO Status</TableCell>
                            <TableCell align="right">SO Date</TableCell>
                            <TableCell align="right">Customer Name</TableCell>
                            <TableCell align="right">Grand Discount</TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                            <TableCell align="right">Grand Total</TableCell>
                            <TableCell align="right">Tax Amount</TableCell>
                            <TableCell align="right">After Tax Amount</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    {searchSalesOrderResp &&
                        <TableBody>
                            {(searchSalesOrderResp.data.length > 0) ? searchSalesOrderResp.data.map(row => (
                                <Row key={row?.id} row={row} />
                            )) :
                                <TableRow><TableCell colSpan={11} align='center'><Typography>Sales order is empty</Typography></TableCell></TableRow>}
                        </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={11}
                                count={searchSalesOrderResp?.totalRecords == undefined ? 0 : searchSalesOrderResp?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={searchSalesOrderResp?.totalRecords == undefined ? 0 : page}
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
    )
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