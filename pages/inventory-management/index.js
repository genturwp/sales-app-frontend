import * as React from 'react';
import Typography from '@mui/material/Typography';
import { getSession } from 'next-auth/react';
import DashboardLayout from '../../components/DashboardLayout';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';

import { debounce } from 'lodash';
import { useForm, Controller } from 'react-hook-form';

import { useSelector, useDispatch } from 'react-redux';

import { createMasterItem, searchMasterItem, searchMasterItemInv, updateMasterItem, resetCreateMasteritemResp, resetCreateMasterItemError } from '../../src/redux/slices/master-item-slice';
import { createWarehouse, searchWarehouse, updateWarehouse, resetCreateWarehouseResp, resetCreateWarehouseError } from '../../src/redux/slices/warehouse-slice';
import { createItemCategory, searchItemCategory, resetCreateItemCategoryResp, resetCreateItemCategoryError } from '../../src/redux/slices/item-category-slice';
import { createItemUnit, searchItemUnit, resetCreateItemUnitResp, resetCreateItemUnitError } from '../../src/redux/slices/item-unit-slice';
import { createInventory, searchInventory, resetCreateInventoryError, resetSearchInventoryError, resetCreateInventoryResp, resetSearchInventoryResp } from '../../src/redux/slices/inventory-slice';

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


const Index = ({ session }) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchStr, setSearchStr] = React.useState('');

    const { control: inventoryControl,
        handleSubmit: inventoryHandleSubmit,
        formState: { errors: inventoryErrors },
        reset: inventoryReset,
        setValue: inventorySetValue,
        getValues: inventoryGetValues,
        register: inventoryRegister } = useForm();

    const { control: masterItemControl,
        handleSubmit: masterItemHandleSubmit,
        formState: { errors: masterItemErrors },
        reset: masterItemReset,
        setValue: masterItemSetValue,
        register: masterItemRegister } = useForm();

    const { control: itemCategoryControl,
        handleSubmit: itemCategoryHandleSubmit,
        formState: { errors: itemCategoryErrors },
        reset: itemCategoryReset,
        setValue: itemCategorySetValue,
        register: itemCategoryRegister } = useForm();

    const { control: itemUnitControl,
        handleSubmit: itemUnitHandleSubmit,
        formState: { errors: itemUnitErrors },
        reset: itemUnitReset,
        setValue: itemUnitSetValue,
        register: itemUnitRegister } = useForm();

    const { control: warehouseControl,
        handleSubmit: warehouseHandleSubmit,
        formState: { errors: warehouseErrors },
        reset: warehouseReset } = useForm();

    const dispatch = useDispatch();
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
        createItemCategoryLoading,
        createItemCategoryResp,
        createItemCategoryError,
        searchItemCategoryLoading,
        searchItemCategoryResp,
        searchItemCategoryError,
    } = useSelector((state) => state.itemCategory);

    const {
        createItemUnitLoading,
        createItemUnitResp,
        createItemUnitError,
        searchItemUnitLoading,
        searchItemUnitResp,
        searchItemUnitError,
    } = useSelector((state) => state.itemUnit);

    const {
        createInventoryLoading,
        createInventoryResp,
        createInventoryError,
        searchInventoryLoading,
        searchInventoryResp,
        searchInventoryError,
    } = useSelector((state) => state.inventory);

    const [openInventoryForm, setOpenInventoryForm] = React.useState(false);
    const [masterItemSearchStr, setMasterItemSearchStr] = React.useState('');
    const [warehouses, setWarehouses] = React.useState([]);
    const [warehouseSearchStr, setWarehouseSearchStr] = React.useState('');
    const [openMasterItemForm, setOpenMasterItemForm] = React.useState(false);
    const [openWarehouseForm, setOpenWarehouseForm] = React.useState(false);
    const [itemCategorySearchStr, setItemCategorySearchStr] = React.useState('');
    const [itemUnitSearchStr, setItemUnitSearchStr] = React.useState('');

    const [openItemCategoryForm, setOpenItemCategoryForm] = React.useState(false);
    const [openItemUnitForm, setOpenItemUnitForm] = React.useState(false);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    React.useEffect(() => {
        dispatch(searchMasterItemInv({ token: session.accessToken, page: page, size: rowsPerPage, searchStr: searchStr }));
    }, [page, rowsPerPage, searchStr, session]);

    React.useEffect(() => {
        dispatch(searchMasterItem({ token: session.accessToken, searchStr: masterItemSearchStr }));
    }, [masterItemSearchStr, session]);

    React.useEffect(() => {
        dispatch(searchWarehouse({ token: session.accessToken, searchStr: warehouseSearchStr }));
    }, [warehouseSearchStr, session]);

    React.useEffect(() => {
        dispatch(searchItemCategory({ token: session.accessToken, searchStr: itemCategorySearchStr }));
    }, [itemCategorySearchStr, session]);

    React.useEffect(() => {
        dispatch(searchItemUnit({ token: session.accessToken, searchStr: itemUnitSearchStr }));
    }, [itemUnitSearchStr, session]);

    const handleSearchInventory = (evt) => {
        setSearchStr(evt.target.value);
    }
    const handleOpenInventoryForm = (evt) => {
        setOpenInventoryForm(true);
    }
    const handleCloseInventoryForm = () => {
        inventoryReset({
            masterItem: null,
            warehouses: [],
        });
        dispatch(resetCreateInventoryResp());
        dispatch(resetCreateInventoryError());
        dispatch(searchMasterItemInv({ token: session.accessToken, page: page, size: rowsPerPage, searchStr: searchStr }));
        setOpenInventoryForm(false);
    }

    const onSaveInventory = (params) => {
        let inventories = params.warehouses.map(val => {
            const inventory = {
                masterItemId: params.masterItem.id,
                itemName: params.masterItem.itemName,
                warehouseId: val.id,
                warehouseName: val.warehouseName,
                inventoryQuantity: val.inventoryQuantity
            }
            return inventory;
        });
        const createInventoryReq = {
            masterItem: params.masterItem,
            inventories: inventories,
        };
        dispatch(createInventory({ createInventoryReq: createInventoryReq, token: session.accessToken }));

    }

    const handleAddInitialStock = (evt, warehouse) => {
        let updatedWarehouses = inventoryGetValues('warehouses').map(val => {
            if (val.id === warehouse.id) {
                val = { ...val, inventoryQuantity: parseFloat(evt.target.value) }
            }
            return val;
        });
        inventorySetValue('warehouses', updatedWarehouses);
    }

    const handleCloseMasterItemFormDialog = () => {
        masterItemReset({
            itemName: '',
            itemCode: '',
            itemDescription: '',
            itemCategory: null,
            stockType: '',
            itemWeight: 0,
            itemUnit: null,
            dimension: {
                width: 0,
                length: 0,
                height: 0
            }
        });
        dispatch(resetCreateMasterItemError());
        dispatch(resetCreateMasteritemResp())
        setOpenMasterItemForm(false);
    }

    const onSaveMasterItem = (params) => {
        dispatch(createMasterItem({ token: session.accessToken, data: params }));
        dispatch(searchMasterItem({ token: session.accessToken, searchStr: masterItemSearchStr }));
    }

    const handleCloseItemCategoryForm = (event) => {
        itemCategoryReset({ itemCategoryName: '', itemCategoryDescription: '' });
        dispatch(resetCreateItemCategoryError());
        dispatch(resetCreateItemCategoryResp());
        setOpenItemCategoryForm(false);
    }

    const onSaveItemCategory = (params) => {

        dispatch(createItemCategory({ token: session.accessToken, ...params }))
        dispatch(searchItemCategory({ token: session.accessToken, searchStr: itemCategorySearchStr }))
    }

    const handleCloseItemUnitForm = (event) => {
        itemUnitReset({ unitName: '', unitDescription: '' });
        dispatch(resetCreateItemUnitError());
        dispatch(resetCreateItemUnitResp());
        setOpenItemUnitForm(false);
    }

    const onSaveItemUnit = (params) => {
        dispatch(createItemUnit({ token: session.accessToken, ...params }));
        dispatch(searchItemUnit({ token: session.accessToken, searchStr: itemUnitSearchStr }));
    }

    const handleCloseWarehouseForm = (event) => {
        warehouseReset({ warehouseName: '', warehouseAddress: '', warehouseType: 'FIN' })
        dispatch(resetCreateWarehouseError());
        dispatch(resetCreateWarehouseResp())
        setOpenWarehouseForm(false);
    }

    const onSaveWarehouse = (params) => {
        dispatch(createWarehouse({ token: session.accessToken, data: params }));
        dispatch(searchWarehouse({ token: session.accessToken, searchStr: warehouseSearchStr }));
    }

    const debouncedSearchInventory = React.useMemo(() => debounce(handleSearchInventory, 300), []);

    const debouncedAddInitialStock = React.useMemo(() => debounce(handleAddInitialStock, 300), []);

    const totalStock = (inventories) => {
        let total = 0;
        for (let i = 0; i < inventories.length; i++) {
            total+=inventories[i].inventoryQuantity;
        }
        return total;
    }
    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{display: 'flex', padding: 1}}>
                <Typography fontWeight={600}>Inventory Management</Typography>
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
                    }} label="Search" variant='outlined' size='small' onChange={debouncedSearchInventory} />
                </Box>
                <Box>
                    <Button type='button' variant='contained' onClick={handleOpenInventoryForm}>Create Inventory</Button>
                </Box>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Item Code</TableCell>
                            <TableCell>Item Category</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Stock Type</TableCell>
                            <TableCell>Warehouses</TableCell>
                            <TableCell>Total Stock</TableCell>
                        </TableRow>
                    </TableHead>
                    {searchMasterItemInvResp && <TableBody>
                        {(searchMasterItemInvResp.data.length>0) ? searchMasterItemInvResp.data.map(row => (
                            <TableRow key={row?.id}>
                                <TableCell>{row?.itemName}</TableCell>
                                <TableCell>{row?.itemCode}</TableCell>
                                <TableCell>{row?.itemCategoryName}</TableCell>
                                <TableCell>{row?.unitName}</TableCell>
                                <TableCell>{row?.stockType}</TableCell>
                                <TableCell>{row.inventories && row?.inventories.map(inv => (<Chip sx={{mr: 1}} size='small' key={inv.id} label={`${inv.warehouseName} (${inv.inventoryQuantity})`}/>))}</TableCell>
                                <TableCell>{row.inventories && totalStock(row?.inventories)}</TableCell>
                            </TableRow>))
                            :
                            <TableRow><TableCell colSpan={11} align='center'><Typography>Inventory is empty</Typography></TableCell></TableRow>}

                    </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={11}
                                count={searchMasterItemInvResp?.totalRecords == undefined ? 0 : searchMasterItemInvResp?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={searchMasterItemInvResp?.totalRecords == undefined ? 0 : page}
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
            <Dialog id="inventory-form" open={openInventoryForm} onClose={handleCloseInventoryForm} fullWidth>
                <form onSubmit={inventoryHandleSubmit(onSaveInventory)}>
                    <DialogTitle>Inventory Form</DialogTitle>
                    <DialogContent>
                        {createInventoryResp && <Alert onClose={handleCloseInventoryForm}>Inventory created successfully</Alert>}
                        {createInventoryError && <Alert onClose={handleCloseInventoryForm} severity="error">Create inventory error</Alert>}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: 2,
                                marginTop: 1,
                            }}>
                                <Controller
                                    name="masterItem"
                                    control={inventoryControl}
                                    rules={{ required: "Master item cannot be empty" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            fullWidth
                                            options={searchMasterItemResp}
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
                                            renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.itemName}</li>}
                                            renderInput={(params) => (<TextField {...params}
                                                label="Item Name"
                                                size='small'
                                                fullWidth
                                                error={inventoryErrors.masterItem !== undefined}
                                                helperText={inventoryErrors?.masterItem?.message} />)}
                                        />
                                    )}
                                />
                                <IconButton onClick={(evt) => setOpenMasterItemForm(true)}>
                                    <AddCircleOutlineRoundedIcon color='primary' />
                                </IconButton>
                            </Box>

                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: 2
                            }}>

                                <Controller
                                    name="warehouses"
                                    control={inventoryControl}
                                    rules={{
                                        validate: (val) => {

                                            if (val === undefined || val.length === 0) {
                                                return false;
                                            }
                                            return true;
                                        },
                                        required: "Warehouse cannot be empty"
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            fullWidth
                                            multiple
                                            size='small'
                                            options={searchWarehouseResp}
                                            getOptionLabel={(option) => option.warehouseName}
                                            value={value ?? []}
                                            onChange={(event, newValue) => {
                                                onChange(newValue);
                                                setWarehouses(newValue);
                                            }}
                                            isOptionEqualToValue={(opts, val) => {
                                                return opts.id === val.id;
                                            }}
                                            renderInput={(params) => <TextField {...params}
                                                label="Warehouses"
                                                fullWidth
                                                size='small'
                                                error={inventoryErrors.warehouses !== undefined}
                                                helperText={inventoryErrors.warehouses !== undefined && "Warehouse cannot be empty"} />}
                                        />
                                    )}
                                />

                                <IconButton onClick={(evt) => setOpenWarehouseForm(true)}>
                                    <AddCircleOutlineRoundedIcon color='primary' />
                                </IconButton>
                            </Box>
                            <TableContainer>
                                <Table size='small' sx={{ minWidth: 500 }} aria-label="custom pagination table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={2} align='left'>Stock</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {inventoryGetValues('warehouses') !== undefined && inventoryGetValues('warehouses').map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.warehouseName}</TableCell>
                                                <TableCell><TextField type='number' size='small' defaultValue={0} onChange={(evt) => debouncedAddInitialStock(evt, row)} /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseInventoryForm}>Cancel</Button>

                        <Button type='submit' variant='contained' disabled={createInventoryResp !== null}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog id="master-item-form" open={openMasterItemForm} onClose={handleCloseMasterItemFormDialog} fullWidth>
                <form onSubmit={masterItemHandleSubmit(onSaveMasterItem)}>
                    <DialogTitle>Master Item Form</DialogTitle>
                    <DialogContent>
                        {createMasterItemResp && <Alert onClose={handleCloseMasterItemFormDialog}>Master item created successfully</Alert>}
                        {createMasterItemError && <Alert onClose={handleCloseMasterItemFormDialog} severity="error">Create master item error</Alert>}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Controller name='itemName'
                                control={masterItemControl}
                                defaultValue=""
                                rules={{ required: 'Item name should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Item Name"
                                    variant="outlined"
                                    error={masterItemErrors.itemName?.type === 'required'}
                                    helperText={masterItemErrors.itemName?.message}
                                />}
                            />
                            <Controller name='itemCode'
                                control={masterItemControl}
                                defaultValue=""
                                rules={{ required: 'Item code should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Item Code"
                                    variant="outlined"
                                    error={masterItemErrors.itemCode?.type === 'required'}
                                    helperText={masterItemErrors.itemCode?.message}
                                />}
                            />
                            <Controller name='itemDescription'
                                control={masterItemControl}
                                defaultValue=""
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Item Description"
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />}
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: 2
                            }}>
                                <Controller
                                    name="itemCategory"
                                    control={masterItemControl}
                                    rules={{ required: "Item category cannot be empty" }}
                                    render={({ field: { onChange, value } }) => (<Autocomplete
                                        sx={{
                                            marginTop: 1,
                                            marginBottom: 1
                                        }}
                                        fullWidth
                                        size='small'
                                        options={searchItemCategoryResp}
                                        getOptionLabel={(option) => option.itemCategoryName}
                                        value={value ?? null}
                                        onChange={(event, newValue) => {
                                            onChange(newValue);
                                        }}
                                        isOptionEqualToValue={(opts, val) => {
                                            return opts.id === val.id;
                                        }}
                                        renderInput={(params) => <TextField {...params}
                                            label="Item Category"
                                            fullWidth
                                            size='small'
                                            error={masterItemErrors.itemCategory !== undefined}
                                            helperText={masterItemErrors?.itemCategory?.message} />}
                                    />
                                    )
                                    }
                                />

                                <IconButton onClick={(evt) => setOpenItemCategoryForm(true)}>
                                    <AddCircleOutlineRoundedIcon color='primary' />
                                </IconButton>
                            </Box>
                            <Controller
                                name="stockType"
                                control={masterItemControl}
                                rules={{ required: "Stock type cannot be empty" }}
                                defaultValue="STOCKABLE"
                                render={({ field: { onChange, value } }) => (
                                    <FormControl error={masterItemErrors.stockType !== undefined}>
                                        <FormLabel>Stock Type</FormLabel>
                                        <RadioGroup
                                            value={value ?? "STOCKABLE"}
                                            onChange={(evt) => onChange(evt.target.value)}
                                        >
                                            <FormControlLabel value="STOCKABLE" defaultChecked={true} control={<Radio />} label="Stockable" />
                                            <FormControlLabel value="NON_STOCKABLE" control={<Radio />} label="Non Stockable" />
                                        </RadioGroup>
                                        {masterItemErrors.stockType !== undefined && <FormHelperText>{masterItemErrors?.stockType?.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <Controller name='itemWeight'
                                control={masterItemControl}
                                defaultValue={0}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="number"
                                    label="Item Weight"
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                    }}
                                />}
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: 2
                            }}>
                                <Controller
                                    name='itemUnit'
                                    control={masterItemControl}
                                    rules={{ required: "Item unit cannot be empty" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            sx={{
                                                marginTop: 1,
                                                marginBottom: 1
                                            }}
                                            fullWidth
                                            size='small'
                                            options={searchItemUnitResp}
                                            getOptionLabel={(option) => option.unitName}
                                            value={value ?? null}
                                            onChange={(event, newValue) => {
                                                onChange(newValue);
                                            }}
                                            isOptionEqualToValue={(opts, val) => {
                                                return opts.id === val.id;
                                            }}
                                            renderInput={(params) => <TextField {...params}
                                                label="Item Unit"
                                                fullWidth
                                                size='small'
                                                error={masterItemErrors.itemUnit !== undefined}
                                                helperText={masterItemErrors?.itemUnit?.message}
                                            />}
                                        />
                                    )}
                                />

                                <IconButton onClick={(evt) => setOpenItemUnitForm(true)}>
                                    <AddCircleOutlineRoundedIcon color='primary' />
                                </IconButton>
                            </Box>
                            <FormControl>
                                <FormLabel>Item Dimension</FormLabel>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }}>
                                    <Controller
                                        name="dimension.width"
                                        control={masterItemControl}
                                        defaultValue={0}
                                        render={({ field }) => <TextField {...field}
                                            placeholder="Width"
                                            label="Width"
                                            type='number'
                                            variant='standard'
                                            size='small'
                                            margin='dense'
                                        />
                                        }
                                    />
                                    <Controller
                                        name="dimension.length"
                                        control={masterItemControl}
                                        defaultValue={0}
                                        render={({ field }) => <TextField {...field}
                                            placeholder="Length"
                                            label="Length"
                                            type='number'
                                            variant='standard'
                                            size='small'
                                            margin='dense'
                                        />
                                        }
                                    />
                                    <Controller
                                        name="dimension.height"
                                        control={masterItemControl}
                                        defaultValue={0}
                                        render={({ field }) => <TextField {...field}
                                            placeholder="Height"
                                            label="Height"
                                            type='number'
                                            variant='standard'
                                            size='small'
                                            margin='dense'
                                        />
                                        }
                                    />
                                </Box>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMasterItemFormDialog}>Cancel</Button>

                        <Button type='submit' variant='contained' disabled={createMasterItemResp !== null}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog id="item-category-form" open={openItemCategoryForm} onClose={handleCloseItemCategoryForm} fullWidth>
                <form onSubmit={itemCategoryHandleSubmit(onSaveItemCategory)}>
                    <DialogTitle>Item Category Form</DialogTitle>
                    <DialogContent>
                        {createItemCategoryResp && <Alert onClose={handleCloseItemCategoryForm}>Item category created successfully</Alert>}
                        {createItemCategoryError && <Alert onClose={handleCloseItemCategoryForm} severity="error">Create item category error</Alert>}                
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Controller name='itemCategoryName'
                                control={itemCategoryControl}
                                defaultValue=""
                                rules={{ required: 'Item category name should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Item Category Name"
                                    variant="outlined"
                                    error={itemCategoryErrors.itemCategoryName?.type === 'required'}
                                    helperText={itemCategoryErrors.itemCategoryName?.message}
                                />}
                            />
                            <Controller name='itemCategoryDescription'
                                control={itemCategoryControl}
                                defaultValue=""
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Item Category Description"
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseItemCategoryForm}>Cancel</Button>

                        <Button type='submit' variant='contained' disabled={createItemCategoryResp !== null}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog id="item-unit-form" open={openItemUnitForm} onClose={handleCloseItemUnitForm} fullWidth>
                <form onSubmit={itemUnitHandleSubmit(onSaveItemUnit)}>
                    <DialogTitle>Item Unit Form</DialogTitle>
                    <DialogContent>
                        {createItemUnitResp && <Alert onClose={handleCloseItemUnitForm}>Item unit created successfully</Alert>}
                        {createItemUnitError && <Alert onClose={handleCloseItemUnitForm} severity="error">Create item unit error</Alert>}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Controller name='unitName'
                                control={itemUnitControl}
                                defaultValue=""
                                rules={{ required: 'Item unit name should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Item Unit Name"
                                    variant="outlined"
                                    error={itemCategoryErrors.itemUnitName?.type === 'required'}
                                    helperText={itemCategoryErrors.itemUnitName?.message}
                                />}
                            />
                            <Controller name='unitDescription'
                                control={itemUnitControl}
                                defaultValue=""
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Item Unit Description"
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseItemUnitForm}>Cancel</Button>
                        <Button type='submit' variant='contained' disabled={createItemUnitResp !== null}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog id="warehouse-form" open={openWarehouseForm} onClose={handleCloseWarehouseForm} fullWidth>
                <form onSubmit={warehouseHandleSubmit(onSaveWarehouse)} >
                    <DialogTitle>Warehouse Form</DialogTitle>
                    <DialogContent>
                        {createWarehouseResp && <Alert onClose={handleCloseWarehouseForm}>Warehouse created successfully</Alert>}
                        {createWarehouseError && <Alert onClose={handleCloseWarehouseForm} severity="error">Create warehouse error</Alert>}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Controller name='warehouseName'
                                control={warehouseControl}
                                defaultValue=""
                                rules={{ required: 'Warehouse name should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Warehouse Name"
                                    variant="outlined"
                                    error={warehouseErrors.warehouseName?.type === 'required'}
                                    helperText={warehouseErrors.warehouseName?.message}
                                />}
                            />
                            <Controller name='warehouseAddress'
                                control={warehouseControl}
                                defaultValue=""
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Warehouse address"
                                    variant="outlined"
                                    multiline
                                    rows={2}
                                />}
                            />
                            <Controller
                                name="warehouseType"
                                control={warehouseControl}
                                rules={{ required: "Warehouse type cannot be empty" }}
                                defaultValue="FIN"
                                render={({ field: { onChange, value } }) => (
                                    <FormControl error={warehouseErrors.warehouseType !== undefined}>
                                        <FormLabel>Warehouse Type</FormLabel>
                                        <RadioGroup
                                            value={value ?? "FIN"}
                                            onChange={(evt) => onChange(evt.target.value)}
                                        >
                                            <FormControlLabel value="FIN" defaultChecked={true} control={<Radio />} label="Finish good" />
                                            <FormControlLabel value="RAW" control={<Radio />} label="Raw material" />
                                            <FormControlLabel value="TRA" control={<Radio />} label="Transit" />
                                            <FormControlLabel value="UNFIN" control={<Radio />} label="Unfinished good" />
                                        </RadioGroup>
                                        {warehouseErrors.warehouseType !== undefined && <FormHelperText>{warehouseErrors?.warehouseType?.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseWarehouseForm}>Cancel</Button>
                        <Button type='submit' variant='contained' disabled={createWarehouseResp !== null}>Save</Button>
                    </DialogActions>
                </form>
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