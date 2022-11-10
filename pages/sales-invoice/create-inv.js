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
import {
    searchSalesOrder, resetSearchSoBySoNumberResp, resetSearchSoBySoNumberError, searchSalesOrderBySoNumber
} from '../../src/redux/slices/sales-order-slice';
import {
    createSalesInvoice
} from '../../src/redux/slices/sales-invoice-slice';

const CreateInvoice = ({ session }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        searchSoBySoNumberResp,
    } = useSelector((state) => state.salesOrder);

    const {
        createSalesInvLoading,
        createSalesInvResp,
        createSalesInvError,
    } = useSelector((state) => state.salesInvoice);

    const [selectedSo, setSelectedSo] = React.useState(null);
    const [customerName, setCustomerName] = React.useState('');
    const [customerPhone, setCustomerPhone] = React.useState('');
    const [customerEmail, setCustomerEmail] = React.useState('');
    const [billingAddress, setBillingAddress] = React.useState('');
    const [searchSoNumber, setSearchSoNumber] = React.useState('');
    const [invoiceDate, setInvoiceDate] = React.useState(new Date());
    const [invoiceDueDate, setInvoiceDueDate] = React.useState(new Date());
    const [invoiceAmount, setInvoiceAmount] = React.useState(0);

    React.useState(() => {
        dispatch(searchSalesOrderBySoNumber({ soNumber: searchSoNumber, token: session.accessToken }));
    }, [session, searchSoNumber]);

    const handleOpenListSalesInvoice = () => {
        router.push('/sales-invoice');
    }

    const onSaveSalesInvoice = () => {
        const invReq = {
            invoiceDate: dateFns.format(invoiceDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            soNumber: selectedSo.soNumber,
            soId: selectedSo.id,
            soDate: selectedSo.soDate,
            paymentDueDate: dateFns.format(invoiceDueDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
            customerId: selectedSo.customerId,
            customerName: customerName,
            customerPhone: customerPhone,
            customerEmail: customerEmail,
            billingAddress: billingAddress,
            invoiceAmount: invoiceAmount
        };
        dispatch(createSalesInvoice({salesInvoice: invReq, token: session.accessToken}))
    }
    return (
        <Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', padding: 1, justifyContent: 'space-between' }}>
                    <Box><Typography fontWeight={600}>Create Invoice</Typography></Box>
                    <Box><Button variant='contained' onClick={handleOpenListSalesInvoice}>Back</Button></Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 1
                }}>
                    <Box sx={{
                        minWidth: 400,
                        mr: 2
                    }}>
                        <Autocomplete
                            fullWidth
                            options={searchSoBySoNumberResp || []}
                            size='small'
                            getOptionLabel={(option) => option.soNumber}
                            value={selectedSo ?? null}
                            onChange={(event, newValue) => {
                                setSelectedSo(newValue);
                                setCustomerName(newValue?.customerName);
                                setCustomerPhone(newValue?.customerPhone);
                                setCustomerEmail(newValue?.customerEmail);
                                setBillingAddress(newValue?.billingAddress);
                                setInvoiceDueDate(dateFns.parseISO(newValue?.paymentDueDate));
                                setInvoiceAmount(newValue?.afterTaxAmount);
                            }}
                            isOptionEqualToValue={(opts, val) => {
                                return opts.id === val.id;
                            }}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            renderOption={(props, option) => <li {...props}>{option.addNewItem ?? option.soNumber}</li>}
                            renderInput={(params) => (<TextField {...params}
                                label="So number"
                                margin='dense'
                                size='small'
                                fullWidth
                                error={selectedSo === null}
                                helperText={(selectedSo === null) && 'Customer cannot be empty'} />)}
                        />
                    </Box>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Invoice Date"
                            value={invoiceDate}
                            onChange={(newValue) => {
                                setInvoiceDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                        />
                    </LocalizationProvider>
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
                        <TextField size='small' label='Name' margin='dense' value={customerName || ''} onChange={(evt) => setCustomerName(evt.target.value)} />
                        <TextField size='small' label='Phone Number' margin='dense' value={customerPhone || ''} onChange={(evt) => setCustomerPhone(evt.target.value)} />
                        <TextField size='small' label='Email' margin='dense' value={customerEmail || ''} onChange={(evt) => setCustomerEmail(evt.target.value)} />
                        <TextField size='small' label='Billing address' margin='dense' value={billingAddress || ''} onChange={(evt) => setBillingAddress(evt.target.value)} />
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: 300,
                        mr: 3
                    }}>
                        <Box sx={{ display: 'flex', padding: 1 }}>
                            <Typography fontWeight={500}>Invoice</Typography>
                        </Box>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Invoice Due Date"
                                value={invoiceDueDate}
                                onChange={(newValue) => {
                                    setInvoiceDueDate(dateFns.parseISO(selectedSo.paymentDueDate));
                                }}
                                renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                            />
                        </LocalizationProvider>
                        <TextField size='small' type='number' label='Invoice amount' margin='dense' value={invoiceAmount || ''} onChange={(evt) => setInvoiceAmount(evt.target.value)} />
                    </Box>
                </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} size='small' aria-label="custom pagination table">
                        <TableHead>
                            <TableRow>
                                <TableCell width={300}>Item Name</TableCell>
                                <TableCell>Item Code</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Inv. Qty</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Qty.</TableCell>
                                <TableCell>Discount</TableCell>
                                <TableCell>Dis. Amount</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell align='right'>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedSo?.salesOrderDetails.map((row, idx) =>
                                <TableRow key={idx}>
                                    <TableCell>{row.itemName}</TableCell>
                                    <TableCell>{row.itemCode}</TableCell>
                                    <TableCell>{row.itemUnit}</TableCell>
                                    <TableCell>{row.inventoryQty}</TableCell>
                                    <TableCell>{row.itemPrice}</TableCell>
                                    <TableCell>{row.salesQty}</TableCell>
                                    <TableCell>{row.itemDiscount}</TableCell>
                                    <TableCell>{row.itemDiscountAmount}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                    <TableCell align='right'>{row.total}</TableCell>
                                </TableRow>)}
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Sub total</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{selectedSo?.totalAmount||''}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={8}>
                                    <Typography fontSize={16} fontWeight={500}>Grand Discount</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{`${selectedSo?.grandDiscount || ''} %`}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{`${selectedSo?.grandDiscountAmount || ''}`}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Shipping Cost</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{selectedSo?.shippingCost}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Tax</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{selectedSo?.taxAmount}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Grand Total</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{selectedSo?.afterTaxAmount}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{mt: 1}}>
                <Button type="button" variant='contained' onClick={onSaveSalesInvoice}>Create Invoice</Button>
            </Box>
        </Box>
    )
}

CreateInvoice.getLayout = function getLayout(page) {
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

export default CreateInvoice;