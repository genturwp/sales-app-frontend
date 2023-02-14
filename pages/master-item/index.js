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

import { createMasterItem, searchMasterItem, searchMasterItemInv, updateMasterItem, resetCreateMasteritemResp, resetCreateMasterItemError, resetUpdateMasterItemError, resetUpdateMasterItemResp } from '../../src/redux/slices/master-item-slice';
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
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [searchStr, setSearchStr] = React.useState('');
    const [openMasterItemForm, setOpenMasterItemForm] = React.useState(false);
    const [openItemCategoryForm, setOpenItemCategoryForm] = React.useState(false);
    const [itemCategorySearchStr, setItemCategorySearchStr] = React.useState('');
    const [itemUnitSearchStr, setItemUnitSearchStr] = React.useState('');
    const [openItemUnitForm, setOpenItemUnitForm] = React.useState(false);
    const [masterItemSearchStr, setMasterItemSearchStr] = React.useState('');
    const [openUpdateMasterItemForm, setOpenUpdateMasterItemForm] = React.useState(false);

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

    React.useEffect(() => {
        dispatch(searchMasterItemInv({ token: session.accessToken, page: page, size: rowsPerPage, searchStr: searchStr }));
    }, [page, rowsPerPage, searchStr, session]);

    React.useEffect(() => {
        dispatch(searchItemCategory({ token: session.accessToken, searchStr: itemCategorySearchStr }));
    }, [itemCategorySearchStr, session]);

    React.useEffect(() => {
        dispatch(searchItemUnit({ token: session.accessToken, searchStr: itemUnitSearchStr }));
    }, [itemUnitSearchStr, session]);

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
    const handleSearchInventory = (evt) => {
        setSearchStr(evt.target.value);
    }
    const debouncedSearchInventory = React.useMemo(() => debounce(handleSearchInventory, 300), []);

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
        dispatch(resetCreateMasteritemResp());
        setOpenMasterItemForm(false);
        dispatch(searchMasterItemInv({ token: session.accessToken, page: page, size: rowsPerPage, searchStr: searchStr }));
    }

    const handleCloseUpdateMasterItemFormDialog = () => {
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
        dispatch(resetUpdateMasterItemError());
        dispatch(resetUpdateMasterItemResp());
        setOpenUpdateMasterItemForm(false);
        dispatch(searchMasterItemInv({ token: session.accessToken, page: page, size: rowsPerPage, searchStr: searchStr }));
    }

    const handleOpenUpdateMasterItemFormDialog = (masterItem) => {
        masterItemSetValue("id", masterItem.id);
        masterItemSetValue("itemName", masterItem.itemName);
        masterItemSetValue("itemCode", masterItem.itemCode);
        masterItemSetValue("itemDescription", masterItem.itemDescription);
        masterItemSetValue("itemCategory", {id:masterItem.itemCategoryId, itemCategoryName: masterItem.itemCategoryName});
        masterItemSetValue("stockType", masterItem.stockType);
        masterItemSetValue("itemWeight", masterItem.itemWeight);
        masterItemSetValue("itemUnit", {id: masterItem.itemUnitId, unitName: masterItem.unitName});
        masterItemSetValue("dimension.width", masterItem.dimension.width);
        masterItemSetValue("dimension.length", masterItem.dimension.length);
        masterItemSetValue("dimension.height", masterItem.dimension.height);
        setOpenUpdateMasterItemForm(true);
    }

    const handleCloseItemCategoryForm = (event) => {
        itemCategoryReset({ itemCategoryName: '', itemCategoryDescription: '' });
        dispatch(resetCreateItemCategoryError());
        dispatch(resetCreateItemCategoryResp());
        setOpenItemCategoryForm(false);
    }

    const onSaveMasterItem = (params) => {
        console.log(params);
        dispatch(createMasterItem({ token: session.accessToken, data: params }));
        dispatch(searchMasterItem({ token: session.accessToken, searchStr: masterItemSearchStr }));
    }

    const onUpdateMasterItem = (params) => {
        const masterItem = {
            id: params.id,
            itemName: params.itemName,
            itemCode: params.itemCode,
            itemDescription: params.itemDescription,
            itemCategoryId: params.itemCategory.id,
            stockType: params.stockType,
            itemWeight: params.itemWeight,
            itemUnitId: params.itemUnit.id,
            dimension: {
                width: params.dimension.width,
                height: params.dimension.height,
                length: params.dimension.length
            },
        };
        dispatch(updateMasterItem({token: session.accessToken, data: masterItem}));
        dispatch(searchMasterItem({ token: session.accessToken, searchStr: masterItemSearchStr }));
    }

    const onSaveItemCategory = (params) => {

        dispatch(createItemCategory({ token: session.accessToken, ...params }))
        dispatch(searchItemCategory({ token: session.accessToken, searchStr: itemCategorySearchStr }))
    }

    const handleOpenMasterItemForm = () => {
        setOpenMasterItemForm(true);
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

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Master Item</Typography>
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
                    <Button type='button' variant='contained' onClick={handleOpenMasterItemForm} >Create Master Item</Button>
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
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    {searchMasterItemInvResp && <TableBody>
                        {(searchMasterItemInvResp.data.length > 0) ? searchMasterItemInvResp.data.map(row => (
                            <TableRow key={row?.id}>
                                <TableCell>{row?.itemName}</TableCell>
                                <TableCell>{row?.itemCode}</TableCell>
                                <TableCell>{row?.itemCategoryName}</TableCell>
                                <TableCell>{row?.unitName}</TableCell>
                                <TableCell>{row?.stockType}</TableCell>
                                <TableCell><Button type='button' variant='contained' size='small' onClick={() => handleOpenUpdateMasterItemFormDialog(row)}>Edit</Button></TableCell>
                            </TableRow>))
                            :
                            <TableRow><TableCell colSpan={6} align='center'><Typography fontSize={'0.8rem'}>Master item is empty</Typography></TableCell></TableRow>}

                    </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={6}
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
            {/* UPDATE MASTER ITEM DIALOG*/}
            <Dialog id="update-master-item-form" open={openUpdateMasterItemForm} onClose={handleCloseUpdateMasterItemFormDialog} fullWidth>
                <form onSubmit={masterItemHandleSubmit(onUpdateMasterItem)}>
                    <DialogTitle>Master Item Form</DialogTitle>
                    <DialogContent>
                        {updateMasterItemResp && <Alert onClose={handleCloseUpdateMasterItemFormDialog}>Master item updated successfully</Alert>}
                        {updateMasterItemError && <Alert onClose={handleCloseUpdateMasterItemFormDialog} severity="error">Update master item error</Alert>}
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
                        <Button onClick={handleCloseUpdateMasterItemFormDialog}>Cancel</Button>

                        <Button type='submit' variant='contained' disabled={updateMasterItemResp!== null}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
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
