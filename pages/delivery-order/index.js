import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LastPageIcon from '@mui/icons-material/LastPage';
import Collapse from '@mui/material/Collapse';

import Button from '@mui/material/Button';

import * as dateFns from 'date-fns';

import { debounce } from 'lodash';

import { useSelector, useDispatch } from 'react-redux';


import {
    resetSearchDOReqError, resetSearchDOReqLoading, resetSearchDOReqResp, searchDORequest
} from '../../src/redux/slices/delivery-order-slice';

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
    const handleCreateDo = () => {
        const createDoUrl = `/delivery-order/create-do?doReqId=${row.id}`;
        router.push(createDoUrl)
    }
    const handleShowDetailDo = (doId) => {
        const detailDoUrl = `/delivery-order/info/${doId}`;
        router.push(detailDoUrl);
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
                <TableCell><Chip label={row.doRequestStatus} size='small' color='secondary' sx={{fontWeight: 600}}/></TableCell>
                <TableCell>{dateFns.format(new Date(row.shippingDate), "yyyy-MM-dd")}</TableCell>
                <TableCell>{row.customerName}</TableCell>
                <TableCell>{row.customerPhone}</TableCell>
                <TableCell>{row.shippingAddress}</TableCell>
                <TableCell><Button variant='contained' size='small' disabled={row.doRequestStatus == 'CLOSED'} onClick={handleCreateDo}>Create DO</Button></TableCell>
            </TableRow>
            <TableRow>
                <TableCell sx={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{m: 1}}>
                            <Typography fontWeight={500} fontSize={16}>Detail Delivery Order</Typography>
                        </Box>
                        <TableContainer sx={{mb: 3}}>
                            <Table size='small' cellPadding={1}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Do Number</TableCell>
                                        <TableCell>Do Date</TableCell>
                                        <TableCell>Do Status</TableCell>
                                        <TableCell>From Warehouse</TableCell>
                                        <TableCell>Delivery Person</TableCell>
                                        <TableCell>Vehicle No</TableCell>
                                        <TableCell>Receiver</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row?.deliveryOrders != undefined && row?.deliveryOrders.length > 0 ? row.deliveryOrders.map(dat => (
                                    <TableRow key={dat.id}>
                                        <TableCell>{dat.doNumber}</TableCell>
                                        <TableCell>{dateFns.format(new Date(dat.doDate), "yyyy-MM-dd")}</TableCell>
                                        <TableCell><Chip label={dat.doStatus} color='secondary' size='small' sx={{fontWeight: 600}}/></TableCell>
                                        <TableCell>{dat.fromWarehouse}</TableCell>
                                        <TableCell>{dat.deliveryPerson}</TableCell>
                                        <TableCell>{dat.vehicleNo}</TableCell>
                                        <TableCell>{dat.receiver}</TableCell>
                                        <TableCell><Button size='small' variant='contained' color='info' onClick={() => handleShowDetailDo(dat.id)}>detail</Button></TableCell>
                                    </TableRow>)) : 
                                    <TableRow>
                                        
                                    </TableRow>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const Index = ({ session }) => {

    const [searchDoReqStr, setSearchDoReqStr] = React.useState('');
    const [searchDoNumber, setSearchDoNumber] = React.useState('');
    const [filterDoReqStatus, setFilterDoReqStatus] = React.useState('');
    const [filterBeginShippingDate, setFilterBeginShippingDate] = React.useState(null);
    const [filterEndShippingDate, setFilterEndShippingDate] = React.useState(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const dispatch = useDispatch();
    const {
        searchDOReqLoading,
        searchDOReqResp,
        searchDOReqError,
    } = useSelector((state) => state.deliveryOrder);

    React.useEffect(() => {
        dispatch(searchDORequest({ token: session.accessToken, searchStr: searchDoReqStr, page: page, size: rowsPerPage, doRequestStatus: filterDoReqStatus, doNumber: searchDoNumber }));
    }, [searchDoReqStr, page, rowsPerPage, filterDoReqStatus, filterBeginShippingDate, filterEndShippingDate, searchDoNumber])

    const handleSearchDOReq = (evt) => {
        setSearchDoReqStr(evt.target.value);
    }
    const debouncedSearchDOReq = React.useMemo(() => debounce(handleSearchDOReq, 300), []);

    const handleSearchDoNumber = (evt) => {
        setSearchDoNumber(evt.target.value);
    }
    const debouncedSearchDONumber = React.useMemo(() => debounce(handleSearchDoNumber, 300), []);
    const handleSelectedDoReqStatus = (evt) => {
        setFilterDoReqStatus(evt.target.value);
    }
    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Delivery Orders</Typography>
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
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                }}>
                    <TextField sx={{
                        width: 300,
                        mr: 1,
                    }} label="Search" variant='outlined' size='small' onChange={debouncedSearchDOReq} />
                    <FormControl sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel>Do Request Status</InputLabel>
                        <Select
                            value={filterDoReqStatus}
                            label="Do Request Status"
                            onChange={handleSelectedDoReqStatus}
                            size='small'>
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="OPEN">Open</MenuItem>
                            <MenuItem value="PARTIAL">Partial</MenuItem>
                            <MenuItem value="CLOSED">Close</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField sx={{
                        width: 300
                    }} label="Search By DO Number" variant='outlined' size='small' onChange={debouncedSearchDONumber}/>
                </Box>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>SO Number</TableCell>
                            <TableCell>DO Request Status</TableCell>
                            <TableCell>Shipping Date</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Customer Phone</TableCell>
                            <TableCell>Shipping Address</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    {searchDOReqResp &&
                        <TableBody>
                            {(searchDOReqResp.data.length > 0) ? searchDOReqResp.data.map(row => (
                                <Row key={row?.id} row={row} />
                            )) :
                                <TableRow><TableCell colSpan={8} align='center'><Typography>Delivery order request is empty</Typography></TableCell></TableRow>}
                        </TableBody>}
                </Table>
            </TableContainer>
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