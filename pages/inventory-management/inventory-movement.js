import * as React from 'react';
import { getSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import DashboardLayout from '../../components/DashboardLayout';
import {
    createInventoryMovement,
    findAllInvMovement,
    resetCreateInventoryMovementError,
    resetCreateInventoryMovementResp,
    resetFindAllInvMovementData,
    resetFindAllInvMovementError
} from '../../src/redux/slices/inventory-movement-slice';
import {
    createMasterItem,
    searchMasterItem,
    searchMasterItemInv,
    updateMasterItem,
    resetCreateMasteritemResp,
    resetCreateMasterItemError
} from '../../src/redux/slices/master-item-slice';
import {
    createWarehouse,
    searchWarehouse,
    updateWarehouse,
    resetCreateWarehouseResp,
    resetCreateWarehouseError
} from '../../src/redux/slices/warehouse-slice';
import {
    findInventoryByMasterItem
} from '../../src/redux/slices/inventory-slice';
import { useSelector, useDispatch } from 'react-redux';
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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import * as dateFns from 'date-fns';

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

const InventoryMovement = ({ session }) => {

    const { createInventoryMovementLoading,
        createInventoryMovementError,
        createInventoryMovementResp,
        findAllInvMovementLoading,
        findAllInvMovementError,
        findAllInvMovementData } = useSelector((state) => state.inventoryMovement);

    const { createMasterItemLoading,
        createMasterItemResp,
        createMasterItemError,
        searchMasterItemLoading,
        searchMasterItemResp,
        searchMasterItemError,
        searchMasterItemInvLoading,
        searchMasterItemInvResp,
        searchMasterItemInvError,
        updateMasterItemLoading,
        updateMasterItemResp,
        updateMasterItemError } = useSelector((state) => state.masterItem);

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
        getInventoriesError,
        getInventoriesResp
    } = useSelector((state) => state.inventory);

    const dispatch = useDispatch();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [masterItemSearchStr, setMasterItemSearchStr] = React.useState('');
    const [selectedMasterItem, setSelectedMasterItem] = React.useState(null);
    const [selectedFromWarehouse, setSelectedFromWarehouse] = React.useState(null);
    const [selectedToWarehouse, setSelectedToWarehouse] = React.useState(null);
    const [movedQuantity, setMovedQuantity] = React.useState(0);

    React.useEffect(() => {
        dispatch(findAllInvMovement({ page: page, size: rowsPerPage, token: session.accessToken }));
    }, [page, rowsPerPage, session, createInventoryMovementResp]);

    React.useEffect(() => {
        dispatch(searchMasterItem({ token: session.accessToken, searchStr: masterItemSearchStr }));
    }, [masterItemSearchStr, session]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onSelectMasterItem = (item) => {
        setSelectedMasterItem(item);
        if (item) {
            dispatch(findInventoryByMasterItem({ itemId: item.id, token: session.accessToken }));
        }
    }

    const onSelectFromWarehouse = (warehouse) => {
        setSelectedFromWarehouse(warehouse);
        setSelectedToWarehouse(null);
        dispatch(searchWarehouse({ searchStr: '', token: session.accessToken }));
    }

    const onSelectToWarehouse = (warehouse) => {
        setSelectedToWarehouse(warehouse);
        setMovedQuantity(0);
    }

    const doMoveQuantity = () => {
        
        const invMovement = {
            invMoveDatetime: dateFns.formatISO(new Date()).toString(),
            masterItemId: selectedMasterItem.id,
            itemName: selectedMasterItem.itemName,
            fromWarehouseId: selectedFromWarehouse.warehouseId,
            fromWarehouseName: selectedFromWarehouse.warehouseName,
            toWarehouseId: selectedToWarehouse.id,
            toWarehouseName: selectedToWarehouse.warehouseName,
            movedQuantity: movedQuantity
        };
        dispatch(createInventoryMovement({createInvMovement: invMovement, token: session.accessToken}));
        dispatch(findAllInvMovement({ page: page, size: rowsPerPage, token: session.accessToken }));

    }

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Inventory Movement</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Autocomplete
                    options={searchMasterItemResp}
                    size='small'
                    sx={{
                        width: 200,
                        mr: 2
                    }}
                    getOptionLabel={(option) => option.itemName}
                    value={selectedMasterItem}
                    onChange={(event, newValue) => {
                        onSelectMasterItem(newValue);
                    }}
                    isOptionEqualToValue={(opts, val) => {
                        return opts.id === val.id;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.itemName}</li>}
                    renderInput={(params) => (<TextField {...params}
                        label="Item Name"
                        size='small'
                        fullWidth
                    />)}
                />
                <Autocomplete
                    options={getInventoriesResp}
                    size='small'
                    sx={{
                        width: 200,
                        mr: 2
                    }}
                    disabled={getInventoriesResp.length === 0}
                    getOptionLabel={(option) => option.warehouseName}
                    value={selectedFromWarehouse}
                    onChange={(event, newValue) => {
                        onSelectFromWarehouse(newValue);
                    }}
                    isOptionEqualToValue={(opts, val) => {
                        return opts.id === val.id;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.warehouseName}</li>}
                    renderInput={(params) => (<TextField {...params}
                        label="From Warehouse"
                        size='small'
                        fullWidth
                    />)}
                />
                {selectedFromWarehouse && <Box sx={{ mr: 2 }}>
                    <Typography>{`Qty: ${selectedFromWarehouse?.inventoryQuantity}`}</Typography>
                </Box>}
                <Autocomplete
                    options={searchWarehouseResp.filter((whr) => whr.id !== selectedFromWarehouse?.warehouseId)}
                    size='small'
                    sx={{
                        width: 200,
                        mr: 2
                    }}
                    disabled={selectedFromWarehouse === null}
                    getOptionLabel={(option) => option.warehouseName}
                    value={selectedToWarehouse}
                    onChange={(event, newValue) => {
                        onSelectToWarehouse(newValue);
                    }}
                    isOptionEqualToValue={(opts, val) => {
                        return opts.id === val.id;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.warehouseName}</li>}
                    renderInput={(params) => (<TextField {...params}
                        label="To Warehouse"
                        size='small'
                        fullWidth
                    />)}
                />
                <TextField label="Moved Qty" size='small'
                    disabled={selectedToWarehouse === null}
                    type='number'
                    value={movedQuantity === 0 ? "" : movedQuantity}
                    onChange={(evt) => setMovedQuantity(parseFloat(evt.target.value))}
                    sx={{ mr: 2 }} />

                <Button variant="contained" type="button" disabled={movedQuantity === 0} onClick={(evt) => doMoveQuantity()}>Move</Button>

            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>From Warehouse</TableCell>
                            <TableCell>To Warehouse</TableCell>
                            <TableCell>Moved Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    {findAllInvMovementData && <TableBody>
                        {(findAllInvMovementData.data.length > 0) ? findAllInvMovementData.data.map(row => (
                            <TableRow key={row?.id}>
                                <TableCell>{dateFns.format(new Date(row?.invMoveDatetime), "yyyy-MM-dd")}</TableCell>
                                <TableCell>{row?.itemName}</TableCell>
                                <TableCell>{row?.fromWarehouseName}</TableCell>
                                <TableCell>{row?.toWarehouseName}</TableCell>
                                <TableCell>{row?.movedQuantity}</TableCell>
                            </TableRow>))
                            :
                            <TableRow><TableCell colSpan={5} align='center'><Typography>Inventory is empty</Typography></TableCell></TableRow>}

                    </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={5}
                                count={findAllInvMovementData?.totalRecords == undefined ? 0 : findAllInvMovementData?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={findAllInvMovementData?.totalRecords == undefined ? 0 : page}
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
    );
}

InventoryMovement.getLayout = function getLayout(page) {
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

export default InventoryMovement;