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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import { useForm, Controller } from 'react-hook-form';


import {
    createItemPrice,
    enableOrDisablePrice,
    findPriceWithFilter,
    resetCreateItemPriceError,
    resetCreateItemPriceResp,
    resetEnableOrDisablePriceError,
    resetEnableOrDisablePriceResp,
    resetFindPriceWithFilterError,
    resetFindPriceWithFilterResp,
    resetUpdatePriceError,
    resetUpdatePriceResp,
    updatePrice
} from '../../src/redux/slices/item-price-slice';

import {
    resetCreateMasterItemError, resetSearchMasterItemError, resetSearchMasterItemInvError, resetUpdateMasterItemError, resetCreateMasteritemResp,
    searchMasterItem
} from '../../src/redux/slices/master-item-slice'
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

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

    const {
        createItemPriceLoading,
        createItemPriceResp,
        createItemPriceError,
        findPriceWithFilterLoading,
        findPriceWithFilterResp,
        findPriceWithFilterError,
        enableOrDisablePriceLoading,
        enableOrDisablePriceResp,
        enableOrDisablePriceError,
        updatePriceLoading,
        updatePriceResp,
        updatePriceError,
    } = useSelector((state) => state.itemPrice);

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

    const dispatch = useDispatch();

    const {
        control: createItemPriceControl,
        handleSubmit: createItemPriceHandleSubmit,
        formState: { errors: createItemPriceErrors },
        reset: createItemPriceReset,
        setValue: createItemPriceSetValue,
        register: createItemPriceRegister
    } = useForm();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [masterItem, setMasterItem] = React.useState(null);
    const [lowPrice, setLowPrice] = React.useState(null);
    const [highPrice, setHighPrice] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [openCreateItemPrice, setOpenCreateItemPrice] = React.useState(false);
    const [editedPrice, setEditedPrice] = React.useState(0);
    const [editPriceId, setEditPriceId] = React.useState(null);

    React.useEffect(() => {
        dispatch(findPriceWithFilter({ page: page, size: rowsPerPage, itemId: masterItem?.id, lowPrice: lowPrice, highPrice: highPrice, token: session.accessToken }));
    }, [page, rowsPerPage, masterItem, lowPrice, highPrice, session, updatePriceResp]);

    React.useEffect(() => {
        if (enableOrDisablePriceResp) {
            dispatch(findPriceWithFilter({ page: 0, size: rowsPerPage, itemId: null, lowPrice: null, highPrice: null, token: session.accessToken }));
        }
    },[session, enableOrDisablePriceResp]);

    React.useEffect(() => {
        dispatch(searchMasterItem({ searchStr: '', token: session.accessToken }))
    }, [session]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSetLowPrice = (val) => {
        setLowPrice(val);
    }
    const handleSetHighPrice = (val) => {
        setHighPrice(val);
    }

    const handleOpenCreateItemPriceForm = (itmPrice) => {
        setSelectedItem(itmPrice);
        createItemPriceSetValue("masterItemId", itmPrice.id);
        setOpenCreateItemPrice(true);
    }

    const handleCloseCreateItemPriceForm = () => {
        createItemPriceReset({
            masterItemId: null, priceEffectiveDate: new Date(), isActive: false, price: 0
        });
        dispatch(resetCreateItemPriceResp());
        dispatch(resetCreateItemPriceError());
        dispatch(findPriceWithFilter({ page: 0, size: rowsPerPage, itemId: null, lowPrice: null, highPrice: null, token: session.accessToken }));

        setOpenCreateItemPrice(false);
    }

    const onSaveCreateItemPrice = (params) => {
        const itemPriceReq = {
            ...params,
            price: parseFloat(params.price),
            priceEffectiveDate: dateFns.formatISO(params.priceEffectiveDate),
        };
        
        dispatch(createItemPrice({ token: session.accessToken, itemPrice: itemPriceReq }));
    }

    const enableOrDisableItemPrice = (itmPrice) => {
        dispatch(enableOrDisablePrice({priceId: itmPrice.itemPriceId, token: session.accessToken}));
    }

    const handleOpenEditItemPriceForm = (itmPrice) => {
        setEditedPrice(itmPrice.price);
        setEditPriceId(itmPrice.id);
    }

    const handleSaveUpdatedPrice = (itmPrice) => {
        
        dispatch(updatePrice({priceId: itmPrice.itemPriceId, price: editedPrice, token: session.accessToken}));
        dispatch(findPriceWithFilter({ page: 0, size: rowsPerPage, itemId: null, lowPrice: null, highPrice: null, token: session.accessToken }));
        setEditPriceId(null);
    }

    const showCreateOrUpdatePriceButton = (itmPrice) => {
        if (itmPrice.itemPriceId === null) {
            return <Button size="small" type="button" variant='contained' onClick={(evt) => handleOpenCreateItemPriceForm(itmPrice)}>Create Price</Button>;
        } else {
            if (editPriceId !== null && editPriceId === itmPrice.id) {
                return <Button type='button' size='small' onClick={(evt) => handleSaveUpdatedPrice(itmPrice)} variant='contained'>Save</Button>;
            } else {
                return <Button type='button' size='small' onClick={(evt) => handleOpenEditItemPriceForm(itmPrice)}>Change Price</Button>;
            }
            
        }
    }

    const handleChangePrice = (price) => {
        
        setEditedPrice(price);
    }

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Pricing Management</Typography>
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
                    alignItems: 'center'
                }}>
                    <Autocomplete
                        sx={{
                            mr: 1,
                            width: 300
                        }}
                        options={searchMasterItemResp}
                        size='small'
                        getOptionLabel={(option) => option.itemName}
                        value={masterItem}
                        onChange={(event, newValue) => {
                            setMasterItem(newValue);
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
                    <TextField sx={{
                        mr: 1
                    }} label="Min price" size='small' type="number" value={lowPrice ?? ""} onChange={(evt) => handleSetLowPrice(evt.target.value)} />
                    <TextField sx={{
                        mr: 1
                    }} label="High price" size='small' type="number" value={highPrice ?? ""} onChange={(evt) => handleSetHighPrice(evt.target.value)} />
                </Box>
            </Box>
            <TableContainer>

                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Item Code</TableCell>
                            <TableCell>Stock Type</TableCell>
                            <TableCell>Is Active</TableCell>
                            <TableCell>Price Effective Date</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    
                    {findPriceWithFilterResp &&
                        <TableBody>
                            {(findPriceWithFilterResp.data.length > 0) ? findPriceWithFilterResp.data.map(row => (
                                <TableRow key={row?.id}>
                                    <TableCell>{row?.itemName}</TableCell>
                                    <TableCell>{row?.itemCode}</TableCell>
                                    <TableCell>{row?.stockType}</TableCell>
                                    <TableCell><Switch checked={row?.isPriceActive} onChange={evt => enableOrDisableItemPrice(row)}/></TableCell>
                                    <TableCell>{row?.priceEffectiveDate}</TableCell>
                                    <TableCell>{editPriceId === row.id ? <TextField size='small' type='number' value={editedPrice} onChange={(evt) => handleChangePrice(evt.target.value)}/> : <Typography>{row?.price}</Typography>}</TableCell>
                                    <TableCell>{showCreateOrUpdatePriceButton(row)}</TableCell>
                                </TableRow>))
                                :
                                <TableRow><TableCell colSpan={7} align='center'><Typography>Item is empty</Typography></TableCell></TableRow>}

                        </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={11}
                                count={findPriceWithFilterResp?.totalRecords == undefined ? 0 : findPriceWithFilterResp?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={findPriceWithFilterResp?.totalRecords == undefined ? 0 : page}
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
            <Dialog id="create-item-price-form" open={openCreateItemPrice} onClose={handleCloseCreateItemPriceForm} fullWidth>
                <form onSubmit={createItemPriceHandleSubmit(onSaveCreateItemPrice)}>
                    <DialogTitle>Create Item Price Form</DialogTitle>
                    <DialogContent>
                        {createItemPriceResp && <Alert onClose={handleCloseCreateItemPriceForm}>Item price created successfully</Alert>}
                        {createItemPriceError && <Alert onClose={handleCloseCreateItemPriceForm} severity="error">Error creating item price</Alert>}
                        <Box sx={{ p: 1 }}>
                            <Typography fontWeight={900} fontSize={20} sx={{ mb: 2 }}>{selectedItem?.itemName}</Typography>
                            <Controller
                                name='priceEffectiveDate'
                                control={createItemPriceControl}
                                rules={{ required: "Price effective date cannot be empty" }}
                                defaultValue={new Date()}
                                render={({ field: { onChange, value } }) => (
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            label="Price Effective Date"
                                            value={value}
                                            onChange={(newValue) => {
                                                onChange(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} size="small"
                                                error={createItemPriceErrors.priceEffectiveDate?.type === 'required'}
                                                helperText={createItemPriceErrors.priceEffectiveDate?.message} />}
                                        />
                                    </LocalizationProvider>
                                )}
                            />
                            <Controller
                                name='isActive'
                                control={createItemPriceControl}
                                defaultValue={false}
                                render={({ field: { onChange, value } }) => (
                                    <FormGroup>
                                        <FormControlLabel control={<Switch value={value} checked={value} onChange={(evt) => onChange(evt.target.checked)} />}
                                            label="Is Price Active" />
                                    </FormGroup>
                                )}
                            />
                            <Controller
                                name='price'
                                control={createItemPriceControl}
                                defaultValue={0}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="number"
                                    label="Price"
                                    variant="outlined"

                                />}
                            />
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button type="button" onClick={handleCloseCreateItemPriceForm}>Cancel</Button>
                        <Button type="submit" variant='contained' disabled={createItemPriceResp !== null}>Save</Button>
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