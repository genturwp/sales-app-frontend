import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import DashboardLayout from '../../../components/DashboardLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import RemoveIcon from '@mui/icons-material/Remove';
import Alert from '@mui/material/Alert';
import { Check, Remove } from '@mui/icons-material';

import { useForm, Controller } from 'react-hook-form';


import {
    updateSOTransaction, resetUpdateSOTransactionError, resetUpdateSOTransactionLoading, resetUpdateSOTransactionResp,
    findSOById, searchSalesItems
} from '../../../src/redux/slices/sales-order-slice';

const SoUpdate = ({ session }) => {

    const router = useRouter();
    const { id } = router.query;
    const {
        findSOByIdResp,
        updateSOTransactionResp,
        searchSalesItemsResp
    } = useSelector((state) => state.salesOrder);

    const dispatch = useDispatch();

    const [searchSalesItemsStr, setSearchSalesItemsStr] = React.useState('');
    const [salesItems, setSalesItems] = React.useState([]);
    const [soNumber, setSoNumber] = React.useState('');
    const [customerPoNumber, setCustomerPoNumber] = React.useState('');
    const [soDate, setSoDate] = React.useState(new Date());
    const [searchCust, setSearchCust] = React.useState('');
    const [selectedCustomer, setSelectedCustomer] = React.useState(null);
    const [customerPhone, setCustomerPhone] = React.useState('');
    const [customerEmail, setCustomerEmail] = React.useState('');
    const [shippingAddress, setShippingAddress] = React.useState('');
    const [shippingDate, setShippingDate] = React.useState(new Date());
    const [shippingCost, setShippingCost] = React.useState(0.0);
    const [customerPickUp, setCustomerPickUp] = React.useState(false);
    const [paymentDueDate, setPaymentDueDate] = React.useState(new Date());
    const [billingAddress, setBillingAddress] = React.useState('');
    const [downpayment, setDownpayment] = React.useState(0.0);
    const [tax, setTax] = React.useState(false);
    const [salesNote, setSalesNote] = React.useState('');
    const [requestDiscount, setRequestDiscount] = React.useState(false);
    const [openCreateCustomerForm, setOpenCreateCustomerForm] = React.useState(false);

    const [grandDiscount, setGrandDiscount] = React.useState(0.0);
    const [grandDiscountAmount, setGrandDiscountAmount] = React.useState(0.0);
    const [openSoUpdateDialog, setOpenSoUpdateDialog] = React.useState(false);

    React.useEffect(() => {
        dispatch(findSOById({ soId: id, token: session.accessToken }));
    }, [id]);

    React.useEffect(() => {
        dispatch(searchSalesItems({ searchStr: searchSalesItemsStr, token: session.accessToken }));
    }, [searchSalesItemsStr, session]);

    React.useEffect(() => {
        if (findSOByIdResp?.salesOrderDetails.length > 0) {

            let mappedSalesItem = findSOByIdResp?.salesOrderDetails.map(dat => ({
                itemName: dat.itemName,
                itemCode: dat.itemCode,
                itemPriceId: dat.itemPriceId,
                inventoryQty: dat.inventoryQty,
                salesQty: dat.salesQty,
                itemUnit: dat.itemUnit,
                itemPrice: dat.itemPrice,
                itemDiscount: dat.itemDiscount,
                amount: dat.amount,
                itemDiscountAmount: dat.itemDiscountAmount,
                masterItemId: dat.masterItemId,
                total: dat.total
            }));
            setSalesItems([...mappedSalesItem]);
        }
    }, [findSOByIdResp]);

    React.useEffect(() => {
        if (updateSOTransactionResp) {
            setOpenSoUpdateDialog(true);
        }
    }, [updateSOTransactionResp])

    const handleCloseSoUpdateDialog = () => {
        setOpenSoUpdateDialog(false);
        dispatch(resetUpdateSOTransactionResp());
    }

    const setSalesQty = (idx, qty) => {
        let salesItms = [...salesItems];
        let amount = qty * salesItms[idx].itemPrice;
        let total = amount - salesItms[idx].itemDiscountAmount;
        salesItms[idx] = { ...salesItms[idx], salesQty: parseFloat(qty), amount: amount, total: total };
        setSalesItems(salesItms);
    }

    const setItemDiscount = (idx, discount) => {
        let salesItms = [...salesItems];
        let discAmount = discount / 100 * salesItms[idx].amount;
        let total = salesItms[idx].amount - discAmount;
        salesItms[idx] = { ...salesItms[idx], itemDiscount: parseFloat(discount), itemDiscountAmount: discAmount, total: total };
        setSalesItems(salesItms);
    }

    const setDiscountAmount = (idx, discountAmount) => {
        let salesItms = [...salesItems];
        let discPercentage = (discountAmount / salesItms[idx].amount) * 100;
        let total = salesItms[idx].amount - discountAmount;
        salesItms[idx] = { ...salesItms[idx], itemDiscount: discPercentage, itemDiscountAmount: parseFloat(discountAmount), total: total };
        setSalesItems(salesItms);
    }

    const removeSalesItem = (idx) => {
        let salesItms = [...salesItems];
        salesItms.splice(idx, 1);
        setSalesItems(salesItms);
    }

    const addSalesItem = (evt) => {
        let items = [...salesItems];
        items.push({
            itemName: '',
            itemCode: '',
            itemPriceId: '',
            inventoryQty: 0.0,
            salesQty: 0.0,
            itemUnit: '',
            itemPrice: 0.0,
            itemDiscount: 0.0,
            amount: 0.0,
            itemDiscountAmount: 0.0,
            total: 0.0,
        });
        setSalesItems(items);
    }

    const calculateTotalAmount = () => {
        let totalAmount = 0;
        for (let i = 0; i < salesItems.length; i++) {
            totalAmount += salesItems[i].total;
        }
        return totalAmount;
    }

    const calculateGrandDiscountAmount = (grandDiscount) => {
        let totalAmount = calculateTotalAmount();
        let _grandDiscountAmount = grandDiscount / 100 * totalAmount;

        setGrandDiscountAmount(_grandDiscountAmount);
        setGrandDiscount(grandDiscount);
    }

    const calculateGrandDiscount = (discAmount) => {
        let totalAmount = calculateTotalAmount();
        let _grandDiscount = (discAmount / totalAmount) * 100;
        setGrandDiscount(_grandDiscount);
        setGrandDiscountAmount(discAmount);
    }

    const calculateGrandTotal = () => {
        let _shippingCost = shippingCost ? shippingCost : 0;
        let grandTotal = calculateTotalAmount() + parseFloat(_shippingCost) - parseFloat(grandDiscountAmount);
        return grandTotal;
    }

    const calculateTax = () => {
        if (tax) {
            let taxAmount = calculateGrandTotal() * 0.11;
            return taxAmount;
        }
        return 0;
    }

    const calculateAfterTax = () => {
        let total = calculateGrandTotal() + calculateTax();
        return total;
    }


    let numFormat = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        roundingMode: 'ceil',
    });

    const onCancelEditSO = () => {

    }

    const onSaveEditSO = () => {
        let updatedSO = {
            ...findSOByIdResp,
            grandDiscount: parseFloat(grandDiscount),
            totalAmount: calculateTotalAmount(),
            grandDiscountAmount: parseFloat(grandDiscountAmount),
            grandTotal: calculateGrandTotal(),
            afterTaxAmount: calculateAfterTax(),
            salesOrderDetails: [...salesItems]
        };

        dispatch(updateSOTransaction({ soDraft: updatedSO, token: session.accessToken }))
    }

    return (
        <Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                {console.log(findSOByIdResp)}
                <Box sx={{ display: 'flex', padding: 1 }}>
                    <Typography fontWeight={600} fontSize={20}>Update Sales Order Draft</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
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
                                    <Typography>{findSOByIdResp?.customerName}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ padding: 1 }}>
                                <Box>
                                    <Typography fontSize={14} fontWeight={500}>Customer phone</Typography>
                                </Box>
                                <Box>
                                    <Typography>{findSOByIdResp?.customerPhone}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ padding: 1 }}>
                                <Box>
                                    <Typography fontSize={14} fontWeight={500}>Customer email</Typography>
                                </Box>
                                <Box>
                                    <Typography>{findSOByIdResp?.customerEmail}</Typography>
                                </Box>
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
                                <Typography>{findSOByIdResp?.shippingAddress}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Shipping Date</Typography>
                            </Box>
                            <Box>
                                <Typography>{findSOByIdResp?.shippingDate ? dateFns.format(new Date(findSOByIdResp.shippingDate), "yyyy-MM-dd") : dateFns.format(new Date(), "yyyy-MM-dd")}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Shipping Cost</Typography>
                            </Box>
                            <Box>
                                <Typography>{numFormat.format(findSOByIdResp?.shippingCost)}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Customer Picked Up</Typography>
                            </Box>
                            <Box>
                                {findSOByIdResp?.customerPickedUp ? <Typography>True</Typography> : <Typography>False</Typography>}
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
                            <Typography fontWeight={600}>Payment Info</Typography>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Billing Address</Typography>
                            </Box>
                            <Box>
                                <Typography>{findSOByIdResp?.billingAddress}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Payment Due Date</Typography>
                            </Box>
                            <Box>
                                <Typography>{findSOByIdResp?.paymentDueDate ? dateFns.format(new Date(findSOByIdResp.paymentDueDate), "yyyy-MM-dd") : dateFns.format(new Date(), "yyyy-MM-dd")}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Down Payment</Typography>
                            </Box>
                            <Box>
                                <Typography>{findSOByIdResp?.downPayment}</Typography>
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
                            <Typography fontWeight={600}>Sales Note</Typography>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Note</Typography>
                            </Box>
                            <Box>
                                <Typography>{findSOByIdResp?.salesNote}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: 1
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                    <Button variant='contained' size='small' onClick={addSalesItem}>Add Sales Item</Button>
                </Box>
                <TableContainer>
                    <Table sx={{ minWidth: 500 }} size='small' aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={300}>Item Name</TableCell>
                                <TableCell>Item Code</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell align='right'>Inv. Qty</TableCell>
                                <TableCell align='right'>Price</TableCell>
                                <TableCell align='right'>Qty.</TableCell>
                                <TableCell align='right'>Discount (%)</TableCell>
                                <TableCell align='right'>Dis. Amount</TableCell>
                                <TableCell align='right'>Amount</TableCell>
                                <TableCell align='right'>Total</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {salesItems.length === 0 && <TableRow><TableCell colSpan={11} align='center'>Sales item is empty</TableCell></TableRow>}
                            {salesItems.length > 0 && salesItems.map((row, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <Autocomplete fullWidth
                                            options={searchSalesItemsResp || []}
                                            size='small'
                                            disablePortal
                                            getOptionLabel={(option) => option.itemName || ''}
                                            value={row}
                                            onChange={(event, newValue) => {

                                                let saleItm = {
                                                    ...row,
                                                    itemName: newValue?.itemName,
                                                    itemCode: newValue?.itemCode,
                                                    itemPriceId: newValue?.itemPriceId,
                                                    inventoryQty: newValue?.inventoryQty,
                                                    itemUnit: newValue?.itemUnit,
                                                    itemPrice: newValue?.itemPrice,
                                                    masterItemId: newValue?.masterItemId,
                                                    salesQty: 0,
                                                    itemDiscount: 0,
                                                    amount: 0,
                                                    total: 0,
                                                    itemDiscountAmount: 0,
                                                    inventoryQty: newValue?.inventoryQty,
                                                };
                                                let saleItms = [...salesItems];
                                                saleItms[idx] = saleItm;
                                                setSalesItems(saleItms);
                                            }}
                                            isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                            selectOnFocus
                                            clearOnBlur
                                            renderOption={(props, option) => <li {...props}>{option.itemName}</li>}
                                            renderInput={(params) => (<TextField {...params}
                                                label="Item Name"
                                                margin='dense'
                                                size='small'
                                                fullWidth
                                            />)}
                                        />
                                    </TableCell>
                                    <TableCell><Typography fontSize={14}>{row.itemCode}</Typography></TableCell>
                                    <TableCell><Typography fontSize={14}>{row.itemUnit}</Typography></TableCell>
                                    <TableCell align='right'><Typography fontSize={14}>{numFormat.format(row.inventoryQty)}</Typography></TableCell>
                                    <TableCell align='right'><Typography fontSize={14}>{numFormat.format(row.itemPrice)}</Typography></TableCell>
                                    <TableCell align='right'>
                                        <TextField onInput={(evt) => {
                                            let inp = evt.target.value;
                                            if (inp < 0) {
                                                evt.target.value = -1 * inp;
                                            }
                                        }} sx={{ width: 100, fontSize: 14 }} size="small" margin='dense' value={row.salesQty} type='number' onChange={(evt) => setSalesQty(idx, evt.target.value)} />
                                    </TableCell>
                                    <TableCell align='right'>
                                        <TextField onInput={(evt) => {
                                            let inp = evt.target.value;
                                            if (inp < 0) {
                                                evt.target.value = -1 * inp;
                                            }
                                        }} sx={{ width: 100, fontSize: 14 }} size="small" margin='dense' value={row.itemDiscount} type='number' onChange={(evt) => setItemDiscount(idx, evt.target.value)} />
                                    </TableCell>
                                    <TableCell align='right'>
                                        <TextField onInput={(evt) => {
                                            let inp = evt.target.value;
                                            if (inp < 0) {
                                                evt.target.value = -1 * inp;
                                            }
                                        }} sx={{ width: 100, fontSize: 14 }} size="small" margin='dense' value={row.itemDiscountAmount} type='number' onChange={(evt) => setDiscountAmount(idx, evt.target.value)} />
                                    </TableCell>
                                    <TableCell align='right'><Typography fontSize={14}>{numFormat.format(row.amount)}</Typography></TableCell>
                                    <TableCell align='right'><Typography fontSize={14} fontWeight={500}>{numFormat.format(row.total)}</Typography></TableCell>
                                    <TableCell>
                                        <IconButton size='small' onClick={() => removeSalesItem(idx)}>
                                            <Remove sx={{ fontSize: 'medium' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(salesItems.length > 0) &&
                                <>
                                    <TableRow>
                                        <TableCell align='right' colSpan={9}>
                                            <Typography fontSize={14} fontWeight={500}>Sub total</Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography fontSize={14} fontWeight={500}>{numFormat.format(calculateTotalAmount())}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right' colSpan={8}>
                                            <Typography fontSize={14} fontWeight={500}>Grand Discount</Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <TextField onInput={(evt) => {
                                                let inp = evt.target.value;
                                                if (inp < 0) {
                                                    evt.target.value = -1 * inp;
                                                }
                                            }} sx={{ fontSize: 14, width: 100 }} value={grandDiscount} type='number' size='small' margin='dense' onChange={(evt) => calculateGrandDiscountAmount(evt.target.value)} />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <TextField onInput={(evt) => {
                                                let inp = evt.target.value;
                                                if (inp < 0) {
                                                    evt.target.value = -1 * inp;
                                                }
                                            }} sx={{ fontSize: 14, width: 100 }} value={grandDiscountAmount} type='number' size='small' margin='dense' onChange={(evt) => calculateGrandDiscount(evt.target.value)} />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right' colSpan={9}>
                                            <Typography fontSize={14} fontWeight={500}>Grand total</Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography fontSize={14} fontWeight={500}>{numFormat.format(calculateGrandTotal())}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right' colSpan={9}>
                                            <Typography fontSize={14} fontWeight={500}>Shipping cost</Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography fontSize={14} fontWeight={500}>{numFormat.format(shippingCost ? shippingCost : 0)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='right' colSpan={9}>
                                            <FormControlLabel control={<Checkbox value={tax} onChange={(evt, checked) => setTax(checked)} />} label={<Typography fontSize={14} fontWeight={500}>Tax</Typography>} />
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography fontSize={14} fontWeight={500}>{numFormat.format(calculateTax())}</Typography>
                                        </TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell align='right' colSpan={9}>
                                            <Typography fontSize={14} fontWeight={500}>Total</Typography>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Typography fontSize={14} fontWeight={500}>{numFormat.format(calculateAfterTax())}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', padding: 1 }}>
                <Button sx={{ mr: 2 }} onClick={() => router.push(`/sales-order/info/${findSOByIdResp?.id}`)}>Cancel</Button>
                <Button variant='contained' onClick={onSaveEditSO}>Save</Button>
            </Box>
            <Dialog
                open={openSoUpdateDialog}
                onClose={handleCloseSoUpdateDialog}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Sales order has been updated"}
                </DialogTitle>
                
                <DialogActions>
                    <Button onClick={handleCloseSoUpdateDialog} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

SoUpdate.getLayout = function getLayout(page) {
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

export default SoUpdate;