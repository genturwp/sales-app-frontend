import * as React from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import PropTypes from 'prop-types';
import { signOut, getSession } from 'next-auth/react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
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
import LastPageIcon from '@mui/icons-material/LastPage';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
    fetchGoodReceiveWithPaging, createGoodReceive
} from '../../src/redux/slices/good-reveive-slice';

import {
    searchSupplier
} from '../../src/redux/slices/supplier-slice';

import {
    searchInventory
} from '../../src/redux/slices/inventory-slice';

import { searchMasterItem, searchInventoryItemNoPaging } from '../../src/redux/slices/master-item-slice';
import { searchWarehouse } from '../../src/redux/slices/warehouse-slice';


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
    let numFormat = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        roundingMode: 'ceil',
    });
    return (
        <React.Fragment>

            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="right">{dateFns.format(new Date(row.receiveDate), "yyyy-MM-dd")}</TableCell>
                <TableCell align="right">{row.itemName}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.warehouseName}</TableCell>
                <TableCell align="right">{row.supplierName}</TableCell>
                <TableCell align="right">{row.receiverName}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const Index = ({ session }) => {
    const dispatch = useDispatch();
    const {
        fetchGoodReceiveWithPagingLoading,
        fetchGoodReceiveWithPagingResp,
        fetchGoodReceiveWithPagingError,
        createGoodReceiveLoading,
        createGoodReceiveResp,
        createGoodReceiveError
    } = useSelector((state) => state.goodReceive);

    const { searchMasterItemResp, searchInventoryItemNoPagingResp } = useSelector((state) => state.masterItem);

    const { searchWarehouseResp } = useSelector((state) => state.warehouse);

    const { searchSupplierResp } = useSelector((state) => state.supplier);

    const { searchInventoryResp } = useSelector((state) => state.inventory);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openGoodReceiveForm, setOpenGoodReceiveForm] = React.useState(false);
    const [masterItemSearchStr, setMasterItemSearchStr] = React.useState('');
    const [warehouseSearchStr, setWarehouseSearchStr] = React.useState('');
    const [supplierNameSearchStr, setSupplierNameSearchStr] = React.useState('');
    const [inventorySearchStr, setInventorySearchStr] = React.useState('');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { control: goodReceiveControl,
        handleSubmit: goodReceiveHandleSubmit,
        formState: { errors: goodReceiveErrors },
        reset: goodReceiveReset,
        setValue: goodReceiveSetValue,
        getValues: goodReceiveGetValues,
        register: goodReceiveRegister } = useForm();

    React.useEffect(() => {
        dispatch(fetchGoodReceiveWithPaging({ page: page, size: rowsPerPage, token: session.accessToken }));
    }, [page, rowsPerPage, createGoodReceiveResp])

    React.useEffect(() => {
        dispatch(searchInventoryItemNoPaging({ token: session.accessToken, searchStr: masterItemSearchStr }));
    }, [masterItemSearchStr, session]);

    React.useEffect(() => {
        dispatch(searchWarehouse({ token: session.accessToken, searchStr: warehouseSearchStr }));
    }, [warehouseSearchStr, session]);

    React.useEffect(() => {
        dispatch(searchSupplier({ token: session.accessToken, supplierName: supplierNameSearchStr }));
    }, [supplierNameSearchStr, session]);

    React.useEffect(() => {
        dispatch(searchInventory({ token: session.accessToken, searchStr: inventorySearchStr }));
    }, [inventorySearchStr, session]);

    const logout = () => {
        signOut();
    }

    const handleOpenCreateGoodReceive = () => {
    
        setOpenGoodReceiveForm(true);
    }

    const handleCloseCreateGoodReceiveForm = () => {
        setOpenGoodReceiveForm(false);
    }

    const onSaveGoodReceive = (params) => {
        
        const goodReceiveReq = {
            receiveDate: dateFns.format(params.receiveDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            itemName: params.masterItem.itemName,
            quantity: parseInt(params.quantity),
            warehouseName: params.masterItem.warehouseName,
            supplierId: params.supplier.id,
            supplierName: params.supplier.supplierName,
            receiverName: params.receiverName,
            masterItemId: params.masterItem.masterItemId,
            warehouseId: params.masterItem.warehouseId,
            inventoryId: params.masterItem.id
        }
        dispatch(createGoodReceive({ goodReceive: goodReceiveReq, token: session.accessToken }));
        goodReceiveReset();
    }

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Goods Receive</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                alignItems: 'center',
                padding: 1
            }}>
                <Box>
                    <Button type='button' variant='contained' onClick={() => handleOpenCreateGoodReceive()}>Create Good Receive</Button>
                </Box>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell align="right"></TableCell> */}
                            <TableCell>Receive Date</TableCell>
                            <TableCell align="right">Item Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Warehouse</TableCell>
                            <TableCell align="right">Supplier Name</TableCell>
                            <TableCell align="right">Receiver Name</TableCell>
                        </TableRow>
                    </TableHead>
                    {fetchGoodReceiveWithPagingResp &&
                        <TableBody>
                            {(fetchGoodReceiveWithPagingResp.data.length > 0) ? fetchGoodReceiveWithPagingResp.data.map(row => (
                                <Row key={row?.id} row={row} />
                            )) :
                                <TableRow><TableCell colSpan={6} align='center'><Typography fontSize={'0.8rem'}>Sales order is empty</Typography></TableCell></TableRow>}
                        </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={11}
                                count={fetchGoodReceiveWithPagingResp?.totalRecords == undefined ? 0 : fetchGoodReceiveWithPagingResp?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={fetchGoodReceiveWithPagingResp?.totalRecords == undefined ? 0 : page}
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

            <Dialog id="master-item-form" open={openGoodReceiveForm} onClose={handleCloseCreateGoodReceiveForm} fullWidth>
                <DialogTitle>Create Good Receive Form</DialogTitle>
                <DialogContent>
                    <form onSubmit={goodReceiveHandleSubmit(onSaveGoodReceive)}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller
                                    name="masterItem"
                                    control={goodReceiveControl}
                                    rules={{ required: "Master item cannot be empty" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            fullWidth
                                            options={searchInventoryResp}
                                            size='small'

                                            getOptionLabel={(option) => option.itemName}
                                            value={value ?? null}
                                            onChange={(event, newValue) => {
                                                onChange(newValue);
                                            }}
                                            isOptionEqualToValue={(opts, val) => {
                                                return opts.id === val.id;
                                            }}
                                            selectOnFocus
                                            clearOnBlur
                                            handleHomeEndKeys
                                            renderOption={(props, option) => {
                                                    const inventoryItem = option.itemName+ ' - '+option.warehouseName;
                                                    return <li {...props} key={option.id}>{option.addNewItem ?? inventoryItem}</li>;
                                                }
                                            }
                                            renderInput={(params) => (<TextField {...params}
                                                label="Item Name"
                                                size='small'
                                                fullWidth
                                                error={goodReceiveErrors.masterItem !== undefined}
                                                helperText={goodReceiveErrors?.masterItem?.message} />)}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='receiveDate'
                                    control={goodReceiveControl}
                                    defaultValue={new Date()}
                                    render={({ field: { onChange, value } }) => <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Sales Order Date"
                                            value={value}
                                            onChange={(newValue) => {
                                                onChange(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                                        />
                                    </LocalizationProvider>}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='quantity'
                                    control={goodReceiveControl}
                                    defaultValue={0}
                                    render={({ field }) => <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        type="number"
                                        label="Quantity"
                                        variant="outlined"
                                    />}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller
                                    name="supplier"
                                    control={goodReceiveControl}
                                    rules={{
                                        required: "supplier cannot be empty"
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            fullWidth
                                            options={searchSupplierResp}
                                            size='small'
                                            getOptionLabel={(option) => option.supplierName}
                                            value={value ?? null}
                                            onChange={(event, newValue) => {
                                                onChange(newValue);
                                            }}
                                            isOptionEqualToValue={(opts, val) => {
                                                return opts.id === val.id;
                                            }}
                                            renderOption={(props, option) => <li {...props} key={option.id}>{option.addNewItem ?? option.supplierName}</li>}
                                            renderInput={(params) => <TextField {...params}
                                                label="Supplier"
                                                fullWidth
                                                size='small'
                                                error={goodReceiveErrors.supplier !== undefined}
                                                helperText={goodReceiveErrors?.supplier?.message} />}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='receiverName'
                                    control={goodReceiveControl}
                                    defaultValue=""
                                    render={({ field }) => <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        label="Receiver Name"
                                        variant="outlined"
                                    />}
                                />
                            </Box>
                        </Box>
                        <DialogActions>
                            <Button onClick={handleCloseCreateGoodReceiveForm}>Cancel</Button>

                            <Button type='submit' variant='contained'>Save</Button>
                        </DialogActions>
                    </form>
                </DialogContent>

            </Dialog>
        </Box>
    );
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