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
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {
    fetchProductionWithPaging, createProduction
} from '../../src/redux/slices/production-slice';

import {
    searchInventory
} from '../../src/redux/slices/inventory-slice';

import { searchMasterItem, searchInventoryItemNoPaging } from '../../src/redux/slices/master-item-slice';
import { searchWarehouse } from '../../src/redux/slices/warehouse-slice';
import { Check, Remove } from '@mui/icons-material';

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

    return (
        <React.Fragment>

            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="left">{dateFns.format(new Date(row.productionDate), "yyyy-MM-dd")}</TableCell>
                <TableCell align="right">{row.itemName}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.warehouseName}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const Index = ({ session }) => {
    const dispatch = useDispatch();
    const {
        fetchProductionWithPagingResp,
        createProductionResp,
    } = useSelector((state) => state.production);

    const { searchInventoryResp } = useSelector((state) => state.inventory);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [openProductionForm, setOpenProductionForm] = React.useState(false);
    const [masterItemSearchStr, setMasterItemSearchStr] = React.useState('');
    const [inventorySearchStr, setInventorySearchStr] = React.useState('');

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { control: productionControl,
        handleSubmit: productionHandleSubmit,
        formState: { errors: productionErrors },
        reset: productionReset,
        setValue: productionSetValue,
        getValues: productionGetValues,
        register: productionRegister,
    } = useForm();

    const {
        fields,
        append,
        remove
    } = useFieldArray({
        control: productionControl,
        name: "prodMaterial"
    });

    React.useEffect(() => {
        dispatch(fetchProductionWithPaging({ page: page, size: rowsPerPage, token: session.accessToken }));
    }, [page, rowsPerPage, createProductionResp])

    React.useEffect(() => {
        dispatch(searchInventoryItemNoPaging({ token: session.accessToken, searchStr: masterItemSearchStr }));
    }, [masterItemSearchStr, session]);


    React.useEffect(() => {
        dispatch(searchInventory({ token: session.accessToken, searchStr: inventorySearchStr }));
    }, [inventorySearchStr, session]);

    const handleOpenCreateProduction = () => {

        setOpenProductionForm(true);
    }

    const handleCloseCreateProduction = () => {
        setOpenProductionForm(false);
    }

    const onSaveProduction = (params) => {

        const productionMaterials = params.prodMaterial.map((val, idx) => {
            return {
                masterItemId: val.itemName.masterItemId,
                itemName: val.itemName.itemName,
                quantity: parseFloat(val.quantity),
                warehouseId: val.itemName.warehouseId,
                warehouseName: val.itemName.warehouseName,
                inventoryId: val.itemName.id
            }
        });
        const createProdReq = {
            productionDate: dateFns.format(new Date(params.productionDate), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            masterItemId: params.masterItem.masterItemId,
            itemName: params.masterItem.itemName,
            quantity: parseFloat(params.quantity),
            warehouseId: params.masterItem.warehouseId,
            warehouseName: params.masterItem.warehouseName,
            inventoryId: params.masterItem.id,
            productionMaterials: productionMaterials
        }
        dispatch(createProduction({production: createProdReq, token: session.accessToken}));
        productionReset();
    }

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Production</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                alignItems: 'center',
                padding: 1
            }}>
                <Box>
                    <Button type='button' variant='contained' onClick={() => handleOpenCreateProduction()}>Create Production Form</Button>
                </Box>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                    <TableHead>
                        <TableRow>
                            {/* <TableCell align="right"></TableCell> */}
                            <TableCell>Production Date</TableCell>
                            <TableCell align="right">Item Name</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Warehouse</TableCell>

                        </TableRow>
                    </TableHead>
                    {fetchProductionWithPagingResp &&
                        <TableBody>
                            {(fetchProductionWithPagingResp.data.length > 0) ? fetchProductionWithPagingResp.data.map(row => (
                                <Row key={row?.id} row={row} />
                            )) :
                                <TableRow><TableCell colSpan={6} align='center'><Typography fontSize={'0.8rem'}>Production is empty</Typography></TableCell></TableRow>}
                        </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={11}
                                count={fetchProductionWithPagingResp?.totalRecords == undefined ? 0 : fetchProductionWithPagingResp?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={fetchProductionWithPagingResp?.totalRecords == undefined ? 0 : page}
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

            <Dialog id="master-item-form" open={openProductionForm} onClose={handleCloseCreateProduction} fullWidth>
                <DialogTitle>Create Production Form</DialogTitle>
                <DialogContent>
                    <form onSubmit={productionHandleSubmit(onSaveProduction)}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller
                                    name="masterItem"
                                    control={productionControl}
                                    rules={{ required: "Master item cannot be empty" }}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            fullWidth
                                            options={searchInventoryResp}
                                            size='small'

                                            getOptionLabel={(option) => `${option.itemName} - ${option.warehouseName}`}
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
                                                const inventoryItem = option.itemName + ' - ' + option.warehouseName;
                                                return <li {...props} key={option.id}>{option.addNewItem ?? inventoryItem}</li>;
                                            }
                                            }
                                            renderInput={(params) => (<TextField {...params}
                                                label="Item Name"
                                                size='small'
                                                fullWidth
                                                error={productionErrors.masterItem !== undefined}
                                                helperText={productionErrors?.masterItem?.message} />)}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='productionDate'
                                    control={productionControl}
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
                                    control={productionControl}
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
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                                    <Button variant='contained' size='small' onClick={() => append({ itemName: null, quantity: 0 })}>Add Production Item</Button>
                                </Box>
                                <TableContainer>
                                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left">Material Name</TableCell>
                                                <TableCell align="right">Quantity</TableCell>
                                                <TableCell align="right"></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((item, index) => <TableRow key={item.id}>
                                                <TableCell>
                                                    <Controller
                                                        name={`prodMaterial.${index}.itemName`}
                                                        control={productionControl}
                                                        rules={{ required: "material item cannot be empty" }}
                                                        render={({ field: { onChange, value } }) => (
                                                            <Autocomplete
                                                                fullWidth
                                                                options={searchInventoryResp}
                                                                size='small'

                                                                getOptionLabel={(option) => `${option.itemName} - ${option.warehouseName}`}
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
                                                                    const inventoryItem = option.itemName + ' - ' + option.warehouseName;
                                                                    return <li {...props} key={option.id}>{option.addNewItem ?? inventoryItem}</li>;
                                                                }
                                                                }
                                                                renderInput={(params) => (<TextField {...params}
                                                                    label="Item Name"
                                                                    size='small'
                                                                    fullWidth
                                                                    error={productionErrors.masterItem !== undefined}
                                                                    helperText={productionErrors?.masterItem?.message} />)}
                                                            />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Controller name={`prodMaterial.${index}.quantity`}
                                                        control={productionControl}
                                                        defaultValue={0}
                                                        render={({ field }) => <TextField {...field}
                                                            fullWidth size="small"
                                                            margin="dense"
                                                            type="number"
                                                            label="Quantity"
                                                            variant="outlined"
                                                        />}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size='small' onClick={() => remove(index)}>
                                                        <Remove sx={{ fontSize: 'medium' }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>)}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Box>
                        <DialogActions>
                            <Button onClick={handleCloseCreateProduction}>Cancel</Button>

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