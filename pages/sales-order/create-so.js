import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import DashboardLayout from '../../components/DashboardLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
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
    createCustomer, resetCreateCustomerError, resetCreateCustomerLoading, resetCreateCustomerResp, resetSearchCustomerError,
    resetSearchCustomerLoading, resetSearchCustomerResp, resetUpdateCustomerError, resetUpdateCustomerLoading, resetUpdateCustomerResp,
    searchCustomer, updateCustomer
} from '../../src/redux/slices/customer-slice';

import {
    createSODraft, resetCreateSODraftError, resetCreateSODraftLoading, resetCreateSODraftResp, resetSearchSalesItemsError, resetSearchSalesItemsLoading,
    resetSearchSalesItemsResp, resetSearchSalesOrderError, resetSearchSalesOrderLoading, resetSearchSalesOrderResp, resetUpdateSODraftToOpenError, resetUpdateSODraftToOpenLoading,
    resetUpdateSODraftToOpenResp, searchSalesItems, searchSalesOrder, updateSODraftToOpen
} from '../../src/redux/slices/sales-order-slice';


const CreateSo = ({ session }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        createCustomerLoading,
        createCustomerError,
        createCustomerResp,
        updateCustomerLoading,
        updateCustomerError,
        updateCustomerResp,
        searchCustomerLoading,
        searchCustomerError,
        searchCustomerResp
    } = useSelector((state) => state.customer);

    const {
        createSODraftLoading,
        createSODraftResp,
        createSODraftError,
        updateSODraftToOpenLoading,
        updateSODraftToOpenResp,
        updateSODraftToOpenError,
        searchSalesOrderLoading,
        searchSalesOrderResp,
        searchSalesOrderError,
        searchSalesItemsLoading,
        searchSalesItemsResp,
        searchSalesItemsError,
    } = useSelector((state) => state.salesOrder);

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
    const [salesItems, setSalesItems] = React.useState([]);
    const [searchSalesItemsStr, setSearchSalesItemsStr] = React.useState('');
    const [grandDiscount, setGrandDiscount] = React.useState(0.0);
    const [grandDiscountAmount, setGrandDiscountAmount] = React.useState(0.0);

    const [openSaveSoDraftNotif, setOpenSaveSoDraftNotif] = React.useState(false);

    const { control: customerControl,
        handleSubmit: customerHandleSubmit,
        formState: { errors: customerErrors },
        reset: customerReset,
        setValue: customerSetValue,
        getValues: customerGetValues,
        register: customerRegister } = useForm();
    
        let numFormat = new Intl.NumberFormat('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            roundingMode: 'ceil',
        });

    React.useEffect(() => {
        dispatch(searchCustomer({ searchStr: searchCust, token: session.accessToken }));
    }, [searchCust, session, createCustomerResp, createCustomerError]);

    React.useEffect(() => {
        dispatch(searchSalesItems({ searchStr: searchSalesItemsStr, token: session.accessToken }));
    }, [searchSalesItemsStr, session]);

    React.useEffect(() => {
        if (createSODraftResp) {
            router.push(`/sales-order/info/${createSODraftResp.id}`)
        }
        return () => {
            dispatch(resetCreateSODraftResp());
            dispatch(resetCreateCustomerResp());
        }
    }, [createSODraftResp]);

    const handleCloseCreateCustomerForm = () => {
        setOpenCreateCustomerForm(false);
        dispatch(resetCreateCustomerError());
        dispatch(resetCreateCustomerResp());
    }

    const onCreateCustomer = (data) => {
        dispatch(createCustomer({ customer: data, token: session.accessToken }))
    }

    const addSalesItem = (evt) => {
        let items = [...salesItems];
        items.push({
            id: '00000000-0000-0000-0000-000000000000',
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

    const setSalesQty = (idx, qty) => {
        let salesItms = [...salesItems];
        let amount = qty * salesItms[idx].itemPrice;
        let total = amount - salesItms[idx].itemDiscountAmount;
        salesItms[idx] = { ...salesItms[idx], salesQty: qty, amount: amount, total: total };
        setSalesItems(salesItms);
    }

    const setItemDiscount = (idx, discount) => {
        let salesItms = [...salesItems];
        let discAmount = discount / 100 * salesItms[idx].amount;
        let total = salesItms[idx].amount - discAmount;
        salesItms[idx] = { ...salesItms[idx], itemDiscount: discount, itemDiscountAmount: discAmount, total: total };
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
        console.log("_grandDiscountAmount = ", _grandDiscountAmount)
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
        let _shippingCost = shippingCost?shippingCost: 0;
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

    const onSaveSODraft = () => {

        if (selectedCustomer === null || customerPhone === '' || shippingAddress === '' || salesItems.length === 0) {
            setOpenSaveSoDraftNotif(true);
        } else {
            let salesOrderItems = salesItems.map(row => ({ ...row, itemDiscount: parseFloat(row.itemDiscount), salesQty: parseFloat(row.salesQty) }));
            const soDraft = {
                customerPoNumber: customerPoNumber,
                soDate: dateFns.format(soDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                customerId: selectedCustomer.id,
                shippingAddress: shippingAddress,
                shippingDate: dateFns.format(shippingDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                shippingCost: parseFloat(shippingCost),
                customerPickedUp: customerPickUp,
                paymentDueDate: dateFns.format(paymentDueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
                billingAddress: billingAddress,
                downPayment: parseFloat(downpayment),
                salesNote: salesNote,
                tax: tax,
                customerPhone: customerPhone,
                customerEmail: customerEmail,
                customerName: selectedCustomer.customerName,
                requestDiscount: requestDiscount,
                grandDiscount: parseFloat(grandDiscount),
                totalAmount: calculateTotalAmount(),
                grandDiscountAmount: parseFloat(grandDiscountAmount),
                grandTotal: calculateGrandTotal(),
                afterTaxAmount: calculateAfterTax(),
                salesOrderDetails: [...salesOrderItems]
            }
            
            dispatch(createSODraft({ soDraft: soDraft, token: session.accessToken }));
        }
    }

    const handleCloseOpenSaveSoDraftNotif = () => {
        setOpenSaveSoDraftNotif(false);
    }

    const onCancelSoDraft = () => {
        setSoDate(new Date());
        setSearchCust('');
        setSelectedCustomer(null);
        setCustomerPhone('');
        setCustomerEmail('');
        setShippingAddress('');
        setShippingDate(new Date());
        setShippingCost(0.0);
        setCustomerPickUp(false);
        setPaymentDueDate(new Date());
        setBillingAddress('');
        setDownpayment(0.0);
        setTax(false);
        setSalesNote('');
        setRequestDiscount(false);
        setOpenCreateCustomerForm(false);
        setSalesItems([]);
        setSearchSalesItemsStr('');
        setGrandDiscount(0.0);
        dispatch(resetCreateSODraftError());
        dispatch(resetCreateSODraftResp());
        dispatch(resetCreateCustomerError());
        dispatch(resetCreateCustomerResp());
    }

    const handleOpenListSalesOrder = () => {
        router.push('/sales-order');
    }

    return (
        <Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', padding: 1, justifyContent: 'space-between' }}>
                    <Box><Typography fontWeight={600}>Create Sales Order</Typography></Box>
                    <Box><Button variant='contained' onClick={handleOpenListSalesOrder}>Back</Button></Box>
                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 1
                }}>
                    <Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start'
                        }}>
                            <TextField sx={{ mr: 1 }} size='small' disabled label='Sales Order No.' margin='dense' value={soNumber} onChange={(evt) => setSoNumber(evt.target.value)} />
                            <TextField sx={{ mr: 1 }} size='small' label='Cust Po No.' margin='dense' value={customerPoNumber} onChange={(evt) => setCustomerPoNumber(evt.target.value)} />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Sales Order Date"
                                    value={soDate}
                                    onChange={(newValue) => {
                                        setSoDate(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    p: 1,
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 300,
                        mr: 3
                    }}>
                        <Box sx={{ display: 'flex', padding: 1 }}>
                            <Typography fontWeight={500}>Customer</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Autocomplete fullWidth
                                options={searchCustomerResp || []}
                                size='small'
                                getOptionLabel={(option) => option.customerName}
                                value={selectedCustomer ?? null}
                                onChange={(event, newValue) => {
                                    setSelectedCustomer(newValue);
                                    setCustomerPhone(newValue?.customerPhone);
                                    setCustomerEmail(newValue?.customerEmail);
                                    setShippingAddress(newValue?.warehouseAddress);
                                    setBillingAddress(newValue?.billingAddress);
                                }}
                                isOptionEqualToValue={(opts, val) => {
                                    return opts.id === val.id;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.customerName}</li>}
                                renderInput={(params) => (<TextField {...params}
                                    label="Customer Name"
                                    margin='dense'
                                    size='small'
                                    fullWidth
                                    error={selectedCustomer === null}
                                    helperText={(selectedCustomer === null) && 'Customer cannot be empty'} />)}
                            />
                            <IconButton onClick={(evt) => setOpenCreateCustomerForm(true)}>
                                <AddCircleOutlineRoundedIcon color='primary' />
                            </IconButton>
                        </Box>
                        <TextField size='small' label='Phone Number' margin='dense' value={customerPhone || ''} onChange={(evt) => setCustomerPhone(evt.target.value)} />
                        <TextField size='small' label='Email' margin='dense' value={customerEmail || ''} onChange={(evt) => setCustomerEmail(evt.target.value)} />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 200,
                        mr: 3
                    }}>
                        <Box sx={{ display: 'flex', padding: 1 }}>
                            <Typography fontWeight={500}>Shipping</Typography>
                        </Box>
                        <TextField size='small' label='Shipping address'
                            margin='dense'
                            value={shippingAddress}
                            onChange={(evt) => setShippingAddress(evt.target.value)}
                            multiline
                            minRows={1}
                            InputLabelProps={{ shrink: true }} />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Shipping Date"
                                value={shippingDate}
                                onChange={(newValue) => {
                                    setShippingDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                            />
                        </LocalizationProvider>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox value={customerPickUp} onChange={(evt, checked) => setCustomerPickUp(checked)} />} label='Customer pick up' />
                        </FormGroup>
                        <TextField size='small' label='Shipping cost' margin='dense' type='number' disabled={customerPickUp} value={shippingCost} onChange={(evt) => setShippingCost(evt.target.value)} />

                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 200,
                        mr: 3
                    }}>
                        <Box sx={{ display: 'flex', padding: 1 }}>
                            <Typography fontWeight={500}>Payment</Typography>
                        </Box>
                        <TextField size='small' label='Billing address'
                            margin='dense'
                            value={billingAddress}
                            onChange={(evt) => setBillingAddress(evt.target.value)}
                            multiline
                            minRows={1}
                            InputLabelProps={{ shrink: true }} 
                            fullWidth/>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Payment due date"
                                value={paymentDueDate}
                                onChange={(newValue) => {
                                    setPaymentDueDate(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                            />
                        </LocalizationProvider>
                        <TextField size='small' label='Downpayment' margin='dense' type='number' value={downpayment} onChange={(evt) => setDownpayment(evt.target.value)} />

                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        mr: 3
                    }}>
                        <Box sx={{ display: 'flex', padding: 1 }}>
                            <Typography fontWeight={500}>Sales Note</Typography>
                        </Box>
                        <TextField size='small' label='Sales Note'
                            margin='dense'
                            value={salesNote}
                            onChange={(evt) => setSalesNote(evt.target.value)}
                            multiline
                            minRows={1}
                            InputLabelProps={{ shrink: true }} 
                            fullWidth/>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox value={requestDiscount} onChange={(evt, checked) => setRequestDiscount(checked)} />} label='Discount' />
                        </FormGroup>
                    </Box>
                </Box>
                <Dialog open={openCreateCustomerForm} onClose={handleCloseCreateCustomerForm}>
                    <form onSubmit={customerHandleSubmit(onCreateCustomer)}>
                        <DialogTitle>Customer Form</DialogTitle>

                        <DialogContent>
                            {createCustomerResp && <Alert onClose={handleCloseCreateCustomerForm}>Customer created successfully</Alert>}
                            {createCustomerError && <Alert onClose={handleCloseCreateCustomerForm} severity="error">Create customer error</Alert>}
                            <Controller
                                name="customerName"
                                control={customerControl}
                                defaultValue=""
                                rules={{ required: "Customer name cannot be empty" }}
                                render={({ field }) => (
                                    <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        type="text"
                                        label="Customer name"
                                        variant="outlined"
                                        error={customerErrors.customerName?.type === 'required'}
                                        helperText={customerErrors.customerName?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="customerPhone"
                                control={customerControl}
                                defaultValue=""
                                rules={{ required: "Customer phone cannot be empty" }}
                                render={({ field }) => (
                                    <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        type="text"
                                        label="Customer phone"
                                        variant="outlined"
                                        error={customerErrors.customerPhone?.type === 'required'}
                                        helperText={customerErrors.customerPhone?.message}
                                    />
                                )}
                            />
                            <Controller
                                name="customerEmail"
                                control={customerControl}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        type="text"
                                        label="Customer email"
                                        variant="outlined"
                                    />
                                )}
                            />
                            <Controller
                                name="warehouseAddress"
                                control={customerControl}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        type="text"
                                        label="Warehouse address"
                                        variant="outlined"
                                        multiline
                                        maxRows={2}
                                    />
                                )}
                            />
                            <Controller
                                name="billingAddress"
                                control={customerControl}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        type="text"
                                        label="billing address"
                                        variant="outlined"
                                        multiline
                                        maxRows={2}
                                    />
                                )}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseCreateCustomerForm}>Cancel</Button>

                            <Button type='submit' variant='contained' disabled={createCustomerResp !== null}>Save</Button>
                        </DialogActions>
                    </form>

                </Dialog>
                <Dialog
                    open={openSaveSoDraftNotif}
                    onClose={handleCloseOpenSaveSoDraftNotif}
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Failed to create sales order"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Customer, customer phone, shipping address and sales item should be filled
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseOpenSaveSoDraftNotif} autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box >
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

                            {(salesItems.length === 0) && <TableRow><TableCell colSpan={11} align='center'>Sales item is empty</TableCell></TableRow>}
                            {(salesItems.length > 0) && salesItems.map((row, idx) => (
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
                                            <Typography fontSize={14} fontWeight={500}>{numFormat.format(shippingCost?shippingCost:0)}</Typography>
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
                <Button sx={{ mr: 2 }} onClick={onCancelSoDraft}>Cancel</Button>
                <Button variant='contained' onClick={onSaveSODraft}>Save</Button>
            </Box>
        </Box>
    );
}

CreateSo.getLayout = function getLayout(page) {
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

export default CreateSo;