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

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { debounce } from 'lodash';

import { useSelector, useDispatch } from 'react-redux';

import {
    resetSearchDOReqError, resetSearchDOReqLoading, resetSearchDOReqResp, searchDORequest,
    getDORequest, resetGetDoRequestError, resetGetDoRequestLoding, resetGetDoRequestResp,
    createDo, getDoByDoReq, resetCreateDoError, resetCreateDoLoading, resetCreateDoResp, resetGetDoByDoReqError, resetGetDoByDoReqLoading,
    resetGetDoByDoReqResp
} from '../../src/redux/slices/delivery-order-slice';

import {
    findInventoryByWarehouseId, resetGetInvByWarehouseIdError, resetGetInvByWarehouseIdResp
} from '../../src/redux/slices/inventory-slice';

import {
    createWarehouse,
    searchWarehouse,
    updateWarehouse,
    resetCreateWarehouseResp,
    resetCreateWarehouseError
} from '../../src/redux/slices/warehouse-slice';

const CreateDo = ({ session }) => {
    const dispatch = useDispatch();
    const {
        getDoRequestResp,
        getDoRequestLoading,
        getDoRequestError,
        createDoLoading,
        createDoResp,
        createDoError,
    } = useSelector((state) => state.deliveryOrder);

    const {
        getInvByWarehouseIdLoading,
        getInvByWarehouseIdResp,
        getInvByWarehouseIdError,
    } = useSelector((state) => state.inventory);

    const router = useRouter();
    const { doReqId } = router.query;

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


    const [doDate, setDoDate] = React.useState(new Date());
    const [selectedFromWarehouse, setSelectedFromWarehouse] = React.useState(null);
    const [vehicleNo, setVehicleNo] = React.useState('');
    const [deliveryPerson, setDeliveryPerson] = React.useState('');
    const [deliveryItems, setDeliveryItems] = React.useState([]);
    const [disableSaveDo, setDisableSaveDo] = React.useState(true);
    const [openItemNotAvailable, setOpenItemNotAvailable] = React.useState(false);
    const [unAvailableItem, setUnAvailableItem] = React.useState(null);

    React.useEffect(() => {
        dispatch(getDORequest({ token: session.accessToken, doReqId: doReqId }));
    }, [doReqId]);

    React.useEffect(() => {
        dispatch(searchWarehouse({ searchStr: '', token: session.accessToken }));
    }, [session.accessToken]);

    React.useEffect(() => {
        if (getDoRequestResp) {
            const items = getDoRequestResp.reservedStocks.map((itm) => ({
                masterItemId: itm.masterItemId,
                salesItemId: itm.salesItemId,
                itemName: itm.itemName,
                salesQty: itm.reservedQuantity,
                itemUnit: itm.itemUnit,
                deliveryQty: 0,
                remainingQty: itm.reservedQuantity,
            }));
            setDeliveryItems([...items]);
        }
    }, [getDoRequestResp]);

    React.useEffect(() => {
        if (createDoResp) {
            router.push('/delivery-order')
        }
        return () => {
            dispatch(resetCreateDoResp());
            setSelectedFromWarehouse(null);
            dispatch(resetGetInvByWarehouseIdResp());
        }
    }, [createDoResp])

    React.useEffect(() => {
        if (deliveryItems.length > 0) {
            let remainingQtyGtZero = deliveryItems.filter(itm => itm.remainingQty != 0);
            let zeroDeliveryQty = remainingQtyGtZero.filter(itm => itm.deliveryQty == 0);
            if (zeroDeliveryQty.length == 0 && selectedFromWarehouse != null) {
                setDisableSaveDo(false);
            } else {                
                setDisableSaveDo(true);
            }
        }

    }, [deliveryItems, selectedFromWarehouse]);

    React.useEffect(() => {
        if (getInvByWarehouseIdResp.length > 0) {
            deliveryItems.forEach(di => {
                let inv = getInvByWarehouseIdResp.filter(whInv => whInv.masterItemId == di.masterItemId);
                if (inv.length == 0) {
                    setOpenItemNotAvailable(true);
                    setUnAvailableItem(di);
                }
            })
        }
    }, [getInvByWarehouseIdResp]);

    const handleCloseItemNotAvailable = () => {
        setOpenItemNotAvailable(false);
        setSelectedFromWarehouse(null);
    }

    const onChangeDeliveryQty = (idx, qty) => {
        let dItems = [...deliveryItems];
        dItems[idx] = { ...dItems[idx], deliveryQty: parseFloat(qty) };
        setDeliveryItems(dItems);
    };

    const handleSaveDo = () => {
        let remainingQtyGtZero = deliveryItems.filter(itm => itm.remainingQty > 0)
        const deliveryOrder = {
            fromWarehouse: selectedFromWarehouse.warehouseName,
            fromWarehouseId: selectedFromWarehouse.id,
            doRequestId: doReqId,
            doDate: dateFns.formatISO(doDate),
            vehicleNo: vehicleNo,
            deliveryPerson: deliveryPerson,
            deliveryItems: [...remainingQtyGtZero]
        };
        dispatch(createDo({ token: session.accessToken, do: deliveryOrder }));
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Create Delivery Order</Typography>
            </Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'row'
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 1,
                }}>
                    <Box sx={{
                        padding: 1
                    }}>
                        <Typography fontWeight={600}>Customer Info</Typography>
                    </Box>
                    <Box sx={{ padding: 1 }}>
                        <Box>
                            <Typography fontSize={14} fontWeight={500}>Customer name</Typography>
                        </Box>
                        <Box>
                            <Typography>{getDoRequestResp?.customerName}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ padding: 1 }}>
                        <Box>
                            <Typography fontSize={14} fontWeight={500}>Customer phone</Typography>
                        </Box>
                        <Box>
                            <Typography>{getDoRequestResp?.customerPhone}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ padding: 1 }}>
                        <Box>
                            <Typography fontSize={14} fontWeight={500}>Customer email</Typography>
                        </Box>
                        <Box>
                            <Typography>{getDoRequestResp?.customerEmail}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 1,
                }}>
                    <Box sx={{
                        padding: 1
                    }}>
                        <Typography fontWeight={600}>Shipping Info</Typography>
                    </Box>
                    <Box sx={{ padding: 1 }}>
                        <Box>
                            <Typography fontSize={14} fontWeight={500}>Shipping Address</Typography>
                        </Box>
                        <Box>
                            <Typography>{getDoRequestResp?.shippingAddress}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ padding: 1 }}>
                        <Box>
                            <Typography fontSize={14} fontWeight={500}>Shipping Date</Typography>
                        </Box>
                        <Box>
                            <Typography>{getDoRequestResp?.shippingDate}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ padding: 1 }}>
                        <Box>
                            <Typography fontSize={14} fontWeight={500}>Shipping Cost</Typography>
                        </Box>
                        <Box>
                            <Typography>{getDoRequestResp?.shippingCost}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 1,
                }}>
                    <Box sx={{ mb: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Delivery Order Date"
                                value={doDate}
                                onChange={(newValue) => {
                                    setDoDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Autocomplete
                        options={searchWarehouseResp}
                        size='small'
                        sx={{
                            width: 300,
                            mb: 1,
                        }}
                        getOptionLabel={(option) => option.warehouseName}
                        value={selectedFromWarehouse}
                        onChange={(event, newValue) => {
                            if (newValue != null) {
                                setSelectedFromWarehouse(newValue);
                                dispatch(findInventoryByWarehouseId({ token: session.accessToken, warehouseId: newValue.id }))
                            }
                        }}
                        isOptionEqualToValue={(opts, val) => {
                            return opts.id === val.id;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderOption={(props, option) => <li {...props}>{option.warehouseName}</li>}
                        renderInput={(params) => (<TextField {...params}
                            label="From Warehouse"
                            size='small'
                            error={selectedFromWarehouse === null}
                            helperText={(selectedFromWarehouse === null) && `warehouse cannot be empty`}
                            fullWidth
                        />)}
                    />
                    <TextField size='small' margin='dense' value={vehicleNo} onChange={(evt) => setVehicleNo(evt.target.value)} label='Vehicle' />
                    <TextField size='small' margin='dense' value={deliveryPerson} onChange={(evt) => setDeliveryPerson(evt.target.value)} label='Delivery Person' />
                </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} size='small' padding='normal' aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={300}>Item Name</TableCell>
                                <TableCell>Item Unit</TableCell>
                                <TableCell>Sales. Qty</TableCell>
                                <TableCell>Remaining. Qty</TableCell>
                                <TableCell>Delivery. Qty</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deliveryItems.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell><Typography>{row?.itemName}</Typography></TableCell>
                                    <TableCell><Typography>{row?.itemUnit}</Typography></TableCell>
                                    <TableCell><Typography>{row?.salesQty}</Typography></TableCell>
                                    <TableCell><Typography>{row?.remainingQty - (isNaN(row?.deliveryQty) ? 0 : row?.deliveryQty)}</Typography></TableCell>
                                    <TableCell><TextField value={row?.deliveryQty}
                                        disabled={row?.remainingQty == 0}
                                        error={(row?.remainingQty != 0) && (row?.deliveryQty <= 0 || (row?.remainingQty - row?.deliveryQty) < 0)}
                                        helperText={(row?.remainingQty != 0) && (((row?.deliveryQty <= 0) && `delivery qty cannot be zero`) || (((row?.remainingQty - row?.deliveryQty) < 0) && `qty cannot greater than remaining qty`))} size='small' margin='dense' type='number' onChange={(evt) => onChangeDeliveryQty(idx, evt.target.value)} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ p: 1 }}>
                <Button disabled={disableSaveDo} variant='contained' size='small' onClick={handleSaveDo}>Save</Button>
            </Box>
            <Dialog open={openItemNotAvailable} onClose={handleCloseItemNotAvailable}>
                <DialogTitle>Inventory not available</DialogTitle>
                <DialogContent>
                    {(selectedFromWarehouse && unAvailableItem) && <Typography>{`Item ${unAvailableItem.itemName} not available in ${selectedFromWarehouse.warehouseName}`}</Typography>}
                </DialogContent>
            </Dialog>
        </Box>
    );
}

CreateDo.getLayout = function getLayout(page) {
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

export default CreateDo;