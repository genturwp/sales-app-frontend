import * as React from 'react';
import { getSession } from 'next-auth/react';
import DashboardLayout from '../../components/DashboardLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSelector, useDispatch } from 'react-redux';
import {
    createStockTake,
    findAllStockTakeWithPaging,
    findStockTakeByWarehouse,
    resetCreateStockTakeError,
    resetCreateStockTakeResp,
    resetFindAllStockTakeWithPagingData,
    resetFindAllStockTakeWithPagingError,
    resetFindStockTakeByWarehouseData,
    resetFindStockTakeByWarehouseError,
    findStockTakeWithFilter,
    resetFindStockTakeWithFilterError,
    resetFindStockTakeWithFilterResp,
} from '../../src/redux/slices/stock-opname-slice';
import {
    createWarehouse,
    searchWarehouse,
    updateWarehouse,
    resetCreateWarehouseResp,
    resetCreateWarehouseError,
    resetSearchWarehouseResp
} from '../../src/redux/slices/warehouse-slice';

import {
    findInventoryByMasterItem,
    findInventoryByWarehouseId,
    resetGetInvByWarehouseIdError,
    resetGetInvByWarehouseIdResp,
} from '../../src/redux/slices/inventory-slice';

import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
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
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Paper from '@mui/material/Paper';
import { el } from 'date-fns/locale';
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

const StockOpname = ({ session }) => {

    const {
        createStockTakeLoading,
        createStockTakeResp,
        createStockTakeError,
        findAllStockTakeWithPagingLoading,
        findAllStockTakeWithPagingData,
        findAllStockTakeWithPagingError,
        findStockTakeByWarehouseLoading,
        findStockTakeByWarehouseData,
        findStockTakeByWarehouseError,
        findStockTakeWithFilterLoading,
        findStockTakeWithFilterResp,
        findStockTakeWithFilterError,
    } = useSelector((state) => state.stockOpname);

    const {
        createWarehouseLoading,
        createWarehouseResp,
        createWarehouseError,
        searchWarehouseLoading,
        searchWarehouseResp,
        searchWarehouseError,
        updateWarehouseLoading,
        updateWarehouseResp,
        updateWarehouseError,
    } = useSelector((state) => state.warehouse);

    const {
        createInventoryLoading,
        createInventoryError,
        createInventoryResp,
        searchInventoryLoading,
        searchInventoryError,
        searchInventoryResp,
        getInventoriesLoading,
        getInventoriesError,
        getInventoriesResp,
        getInvByWarehouseIdLoading,
        getInvByWarehouseIdResp,
        getInvByWarehouseIdError,
    } = useSelector((state) => state.inventory);

    const dispatch = useDispatch();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [selectedWarehouse, setSelectedWarehouse] = React.useState(null);
    const [stockTakeDate, setStockTakeDate] = React.useState(null);
    const [openCreateStockTakeForm, setOpenCreateStockTakeForm] = React.useState(false);
    const [inventoryWarehouse, setInventoryWarehouse] = React.useState(null);
    const [stockTakeData, setStockTakeData] = React.useState([]);

    const [val, setVal] = React.useState('');

    React.useEffect(() => {
        dispatch(searchWarehouse({ searchStr: '', token: session.accessToken }));
    }, [session]);

    React.useEffect(() => {
        let stockTakeDateTimeReq;
        if (stockTakeDate) {
            stockTakeDateTimeReq = (new Date(stockTakeDate).toISOString());
        }
        dispatch(findStockTakeWithFilter({ page: page, size: rowsPerPage, token: session.accessToken, warehouseId: selectedWarehouse?.id, stockTakeDateTime: stockTakeDateTimeReq }));
    }, [page, rowsPerPage, session, selectedWarehouse, stockTakeDate]);

    React.useEffect(() => {
        if (inventoryWarehouse) {
            dispatch(findInventoryByWarehouseId({ warehouseId: inventoryWarehouse?.id, token: session.accessToken }));
        } else {
            dispatch(resetGetInvByWarehouseIdResp());
        }
    }, [inventoryWarehouse]);

    React.useEffect(() => {
        if (getInvByWarehouseIdResp.length > 0) {
            let stockTakes = getInvByWarehouseIdResp.map((dat) => ({
                masterItemId: dat.masterItemId,
                itemName: dat.itemName,
                inventoryId: dat.id,
                warehouseId: dat.warehouseId,
                warehouseName: dat.warehouseName,
                inventoryQuantity: dat.inventoryQuantity,
                realQuantity: 0,
                differentQuantity: 0 - dat.inventoryQuantity,
                stockTakeDatetime: (new Date().toISOString())
            }));
            setStockTakeData(stockTakes);
        } else {
            setStockTakeData([]);
        }

    }, [getInvByWarehouseIdResp]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleCloseCreateStockTakeForm = () => {
        setOpenCreateStockTakeForm(false);
        setInventoryWarehouse(null);
        dispatch(resetSearchWarehouseResp())
        dispatch(resetGetInvByWarehouseIdResp());
        dispatch(findStockTakeWithFilter({ page: page, size: rowsPerPage, token: session.accessToken, warehouseId: null, stockTakeDateTime: null }));
    }

    const onSetRealQuantity = (val, idx) => {
        let realQty = parseFloat(val);
        let newStocktakeData = [...stockTakeData];
        newStocktakeData[idx].realQuantity = realQty;
        newStocktakeData[idx].differentQuantity = realQty -  newStocktakeData[idx].inventoryQuantity;
        // newStocktakeData = newStocktakeData.map((el, i) => {
        //     if (i === idx) {
        //         el.realQuantity = realQty;
        //         el.differentQuantity = realQty - el.inventoryQuantity;    
        //     }
        //     return el;
        // });
        setStockTakeData(newStocktakeData);
    }

    const handleChange = (event) => {
        setVal(event.target.value);
    }

    const onSaveStockTake = (stockTake) => {
        dispatch(createStockTake({stockTake: stockTake, token: session.accessToken}));
    }

    const handleOpenCreateStockTakeForm = () => {
        dispatch(searchWarehouse({ searchStr: '', token: session.accessToken }));
        setOpenCreateStockTakeForm(true);
    }
    let numFormat = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        roundingMode: 'ceil',
    });
    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Stock Opname</Typography>
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
                    justifyContent: 'space-between',
                    padding: 1
                }}>
                    <Autocomplete
                        options={searchWarehouseResp}
                        size='small'
                        sx={{
                            width: 200,
                            mr: 2
                        }}
                        getOptionLabel={(option) => option.warehouseName}
                        value={selectedWarehouse}
                        onChange={(event, newValue) => {
                            setSelectedWarehouse(newValue);
                        }}
                        isOptionEqualToValue={(opts, val) => {
                            return opts.id === val.id;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.warehouseName}</li>}
                        renderInput={(params) => (<TextField {...params}
                            label="Warehouse"
                            size='small'
                            fullWidth
                        />)}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Stock Opname Date"
                            value={stockTakeDate}
                            onChange={(newValue) => {
                                setStockTakeDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} size="small" />}
                        />
                    </LocalizationProvider>
                </Box>
                <Box>
                    <Button type="button" variant='contained' onClick={() => handleOpenCreateStockTakeForm()} >Create Stock Opname</Button>
                </Box>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Warehouse</TableCell>
                            <TableCell>Inventory Quantity</TableCell>
                            <TableCell>Real Quantity</TableCell>
                            <TableCell>Different Quantity</TableCell>
                        </TableRow>
                    </TableHead>

                    {findStockTakeWithFilterResp && <TableBody>
                        {(findStockTakeWithFilterResp.data.length > 0) ? findStockTakeWithFilterResp.data.map(row => (
                            <TableRow key={row?.id}>
                                <TableCell>{dateFns.format(new Date(row?.stockTakeDatetime), "yyyy-MM-dd")}</TableCell>
                                <TableCell>{row?.itemName}</TableCell>
                                <TableCell>{row?.warehouseName}</TableCell>
                                <TableCell>{numFormat.format(row?.inventoryQuantity)}</TableCell>
                                <TableCell>{numFormat.format(row?.realQuantity)}</TableCell>
                                <TableCell>{numFormat.format(row?.differentQuantity)}</TableCell>
                            </TableRow>))
                            :
                            <TableRow><TableCell colSpan={6} align='center'><Typography>Stock opname is empty</Typography></TableCell></TableRow>}

                    </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={5}
                                count={findStockTakeWithFilterResp?.totalRecords == undefined ? 0 : findStockTakeWithFilterResp?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={findStockTakeWithFilterResp?.totalRecords == undefined ? 0 : page}
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
            <Dialog open={openCreateStockTakeForm} onClose={handleCloseCreateStockTakeForm} fullWidth>
                <DialogTitle>Create Stock Take Form</DialogTitle>
                <DialogContent>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 1,
                    }}>
                        <Autocomplete
                            options={searchWarehouseResp}
                            size='small'
                            sx={{
                                width: 200,
                                mr: 2
                            }}
                            getOptionLabel={(option) => option.warehouseName}
                            value={inventoryWarehouse}
                            onChange={(event, newValue) => {
                                setInventoryWarehouse(newValue);
                            }}
                            isOptionEqualToValue={(opts, val) => {
                                return opts.id === val.id;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.warehouseName}</li>}
                            renderInput={(params) => (<TextField {...params}
                                label="Warehouse"
                                size='small'
                                fullWidth
                            />)}
                        />
                    </Box>
                    <Box>
                        <TableContainer>
                            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Name</TableCell>
                                        <TableCell>Inventory Quantity</TableCell>
                                        <TableCell>Real Quantity</TableCell>
                                        <TableCell>Different Quantity</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(stockTakeData.length > 0) ? stockTakeData.map((row, idx) => (
                                        <TableRow key={row?.inventoryId}>
                                            <TableCell>{row?.itemName}</TableCell>
                                            <TableCell>{numFormat.format(row?.inventoryQuantity)}</TableCell>
                                            <TableCell><TextField value={row.realQuantity} type="number" onChange={(evt) => {onSetRealQuantity(evt.target.value, idx)}} size='small' margin='dense' /></TableCell>
                                            <TableCell>{numFormat.format(row?.differentQuantity)}</TableCell>
                                            <TableCell><Button type='button' size='small' onClick={evt => onSaveStockTake(row)}>Save</Button></TableCell>
                                        </TableRow>))
                                        :
                                        <TableRow><TableCell colSpan={4} align='center'><Typography>Inventory is empty</Typography></TableCell></TableRow>}

                                </TableBody>

                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button type="button" variant='contained' onClick={handleCloseCreateStockTakeForm}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

StockOpname.getLayout = function getLayout(page) {
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

export default StockOpname;