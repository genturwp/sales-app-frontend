import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import DashboardLayout from '../../../components/DashboardLayout';
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
import { useSelector, useDispatch, ReactReduxContext } from 'react-redux';
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
import Chip from '@mui/material/Chip';
import { Check, Remove } from '@mui/icons-material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import {
    getSalesInvoiceById, createIncomingPayment
} from '../../../src/redux/slices/sales-invoice-slice';

import {
    createCustomerBank, createOwnerBank, fetchCustomerBank, fetchOwnerBank, fetchAllBankReference,
} from '../../../src/redux/slices/bank-reference-slice';

const DetailInvoice = ({ session }) => {
    const router = useRouter();
    const { id } = router.query;

    const dispatch = useDispatch();
    const {
        getSalesInvoiceByIdResp,
        getSalesInvoiceByIdErr,
        getSalesInvoiceByIdLoading,
        createIncomingPaymentLoading,
        createIncomingPaymentResp,
        createIncomingPaymentErr,
    } = useSelector((state) => state.salesInvoice);

    const {
        fetchCustBankLoading,
        fetchCustBankResp,
        fetchCustBankError,
        fetchOwnerBankLoading,
        fetchOwnerBankResp,
        fetchOwnerBankErr,
        fetchBankRefResp,
        createCustBankResp,
    } = useSelector((state) => state.bankReference);

    const [openCreateIncomingPaymentDialog, setOpenCreateIncomingPaymentDialog] = React.useState(false);
    const [incomingPaymentReq, setIncomingPaymentReq] = React.useState({
        invNumber: null,
        invId: null,
        paymentAmount: 0,
        paymentMethod: '',
        customerBankAccountId: null,
        custBankAccountNo: '',
        custBankAccountName: '',
        custBankName: '',
        ownerBankInfoId: null,
        ownerBankAccountName: '',
        ownerBankAccountNo: '',
        ownerBankName: '',
        ipDate: dateFns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
    });

    const [createCustomerBankReq, setCreateCustomerBankReq] = React.useState({
        bankAccountName: '',
        bankAccountNumber: '',
        bankName: '',
        bankRefId: '',
        customerId: '',
    });

    const [custBankAccountList, setCustBankAccountList] = React.useState([]);
    const [ownerBankAccountList, setOwnerBankAccountList] = React.useState([]);
    const [incPaymentDate, setIncPaymentDate] = React.useState(new Date());
    const [isPaymentExceeded, setIsPaymentExceeded] = React.useState(false);
    const [openCreateCustomerBankDialog, setOpenCreateCustomerBankDialog] = React.useState(false);
    const [bankReferences, setBankReferences] = React.useState([]);

    React.useEffect(() => {
        dispatch(getSalesInvoiceById({ invoiceId: id, token: session.accessToken }));
    }, [createIncomingPaymentResp, session]);

    React.useEffect(() => {
        if (getSalesInvoiceByIdResp) {
            dispatch(fetchCustomerBank({ customerId: getSalesInvoiceByIdResp.customerId, token: session.accessToken }));
            setCreateCustomerBankReq({ ...createCustomerBankReq, customerId: getSalesInvoiceByIdResp?.customerId });
        }
    }, [getSalesInvoiceByIdResp, createCustBankResp, session]);

    React.useEffect(() => {
        if (getSalesInvoiceByIdResp) {
            dispatch(fetchOwnerBank({ token: session.accessToken }));
        }

    }, [getSalesInvoiceByIdResp, session]);

    React.useEffect(() => {
        dispatch(fetchAllBankReference({ token: session.accessToken }));
    }, []);

    React.useEffect(() => {
        if (fetchBankRefResp) {
            const listBankRef = fetchBankRefResp.map(b => ({
                label: b.bankName,
                bankRefId: b.id,
            }));
            setBankReferences(listBankRef);
        }
    }, [fetchBankRefResp]);

    React.useEffect(() => {
        if (fetchCustBankResp) {
            const listCustBankAcct = fetchCustBankResp.map(b => ({
                label: `${b.bankAccountName} - ${b.bankName} - ${b.bankAccountNumber}`,
                custBankAccountName: b.bankAccountName,
                custBankAccountNo: b.bankAccountNumber,
                custBankName: b.bankName,
                customerBankAccountId: b.id,
            }));
            setCustBankAccountList(listCustBankAcct);
        }
    }, [fetchCustBankResp]);

    React.useEffect(() => {
        if (fetchOwnerBankResp) {
            const listCustBankAcct = fetchOwnerBankResp.map(b => ({
                label: `${b.bankAccountName} - ${b.bankName} - ${b.bankAccountNumber}`,
                ownerBankAccountName: b.bankAccountName,
                ownerBankAccountNo: b.bankAccountNumber,
                ownerBankName: b.bankName,
                ownerBankAccountId: b.id,
            }));
            setOwnerBankAccountList(listCustBankAcct);
        }
    }, [fetchOwnerBankResp]);

    React.useEffect(() => {
        setIncomingPaymentReq({
            ...incomingPaymentReq,
            invNumber: getSalesInvoiceByIdResp?.invNumber,
            invId: getSalesInvoiceByIdResp?.id
        });
    }, [getSalesInvoiceByIdResp]);

    React.useEffect(() => {
        setOpenCreateIncomingPaymentDialog(false);
    }, [createIncomingPaymentResp]);

    React.useEffect(() => {
        handleCloseCreateCustomerBankDialog();
    }, [createCustBankResp]);

    const handleOpenIncomingPaymentDialog = () => {
        setOpenCreateIncomingPaymentDialog(true);
    };

    const handleCloseCreateIncomingPaymentDialog = () => {
        setOpenCreateIncomingPaymentDialog(false);
        setIncomingPaymentReq({
            invNumber: null,
            invId: null,
            paymentAmount: 0,
            paymentMethod: '',
            customerBankAccountId: null,
            custBankAccountNo: '',
            custBankAccountName: '',
            custBankName: '',
            ownerBankInfoId: null,
            ownerBankAccountName: '',
            ownerBankAccountNo: '',
            ownerBankName: '',
            ipDate: dateFns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
        });
    };

    const handleSelectPaymentMethod = (evt) => {
        setIncomingPaymentReq({
            ...incomingPaymentReq, paymentMethod: evt.target.value
        });
    };

    const handleSaveIncomingPayment = () => {
        dispatch(createIncomingPayment({ incomingPayment: incomingPaymentReq, token: session.accessToken }));
        setIncomingPaymentReq({
            invNumber: null,
            invId: null,
            paymentAmount: 0,
            paymentMethod: '',
            customerBankAccountId: null,
            custBankAccountNo: '',
            custBankAccountName: '',
            custBankName: '',
            ownerBankInfoId: null,
            ownerBankAccountName: '',
            ownerBankAccountNo: '',
            ownerBankName: '',
            ipDate: dateFns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX"),
        });
    }

    const handleSetPaymentAmount = (paymentAmount) => {
        const checkPaymentExceeded = getSalesInvoiceByIdResp.paidAmount + Number(paymentAmount);
        if (checkPaymentExceeded > getSalesInvoiceByIdResp.invoiceAmount) {
            setIsPaymentExceeded(true);
        } else {
            setIsPaymentExceeded(false);
            setIncomingPaymentReq({ ...incomingPaymentReq, paymentAmount: Number(paymentAmount) });
        }
    }

    const handleCloseCreateCustomerBankDialog = () => {
        setCreateCustomerBankReq({
            bankAccountName: '',
            bankAccountNumber: '',
            bankName: '',
            bankRefId: '',
            customerId: '',
        });
        setOpenCreateCustomerBankDialog(false);
    }

    const handleSaveCustomerBank = () => {
        dispatch(createCustomerBank({ customerBank: createCustomerBankReq, token: session.accessToken }));
    }

    return (
        <Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ padding: 1 }}>
                        <Typography fontWeight={600} fontSize={20}>{`Sales Invoice ${getSalesInvoiceByIdResp?.invNumber}`}</Typography>
                    </Box>

                    <Box sx={{ padding: 1 }}>
                        <Button disabled={getSalesInvoiceByIdResp?.unpaidAmount == 0} type='button' variant='contained' onClick={() => handleOpenIncomingPaymentDialog()}>Create Incoming Payment</Button>
                    </Box>
                </Box>

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
                                <Typography>{getSalesInvoiceByIdResp?.customerName}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Customer phone</Typography>
                            </Box>
                            <Box>
                                <Typography>{getSalesInvoiceByIdResp?.customerPhone}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Customer email</Typography>
                            </Box>
                            <Box>
                                <Typography>{getSalesInvoiceByIdResp?.customerEmail}</Typography>
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
                            <Typography fontWeight={600}>Invoice Info</Typography>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <Box>
                                <Box sx={{ padding: 1 }}>
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>Invoice status</Typography>
                                    </Box>
                                    <Box>
                                        <Chip label={getSalesInvoiceByIdResp?.invStatus} color="primary" />
                                    </Box>
                                </Box>
                                <Box sx={{ padding: 1 }}>
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>Invoice Amount</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{getSalesInvoiceByIdResp?.invoiceAmount}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ padding: 1 }}>
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>Paid Amount</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{getSalesInvoiceByIdResp?.paidAmount}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ padding: 1 }}>
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>Unpaid Amount</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{getSalesInvoiceByIdResp?.unpaidAmount}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box>
                                <Box sx={{ padding: 1 }}>
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>SO Number</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{getSalesInvoiceByIdResp?.soNumber}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ padding: 1 }}>
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>Invoice Date</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{getSalesInvoiceByIdResp?.invoiceDate == null ? getSalesInvoiceByIdResp?.invoiceDate : dateFns.format(new Date(getSalesInvoiceByIdResp?.invoiceDate), "yyyy-MM-dd")}</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ padding: 1 }}>
                                    <Box>
                                        <Typography fontSize={14} fontWeight={500}>Payment Due Date</Typography>
                                    </Box>
                                    <Box>
                                        <Typography>{getSalesInvoiceByIdResp?.paymentDueDate == null ? getSalesInvoiceByIdResp?.paymentDueDate : dateFns.format(new Date(getSalesInvoiceByIdResp?.paymentDueDate), "yyyy-MM-dd")}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </Box>
            <Box sx={{ mt: 1 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell width={300}>Incoming Payment Number</TableCell>
                                <TableCell>Inc. Payment Date</TableCell>
                                <TableCell>Payment Amount</TableCell>
                                <TableCell>Payment method</TableCell>
                                {/* <TableCell>Cust. Bank Info</TableCell> */}
                                <TableCell>Receive. Bank Info</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {getSalesInvoiceByIdResp?.incomingPayments && <>
                                {(getSalesInvoiceByIdResp.incomingPayments.length > 0) ? getSalesInvoiceByIdResp.incomingPayments.map(ip => (
                                    <TableRow key={ip.id}>
                                        <TableCell>{ip.ipNumber}</TableCell>
                                        <TableCell>{dateFns.format(new Date(ip.ipDate), "yyyy-MM-dd")}</TableCell>
                                        <TableCell>{ip.paymentAmount}</TableCell>
                                        <TableCell>{ip.paymentMethod}</TableCell>
                                        {ip.paymentMethod == "TRANSFER" ? <>
                                            {/* <TableCell sx={{
                                                fontSize: 12
                                            }}>{`${ip.custBankAccountName}-${ip.custBankName}-${ip.custBankAccountNo}`}</TableCell> */}
                                            <TableCell sx={{
                                                fontSize: 12
                                            }}>{`${ip.ownerBankAccountName}-${ip.ownerBankName}-${ip.ownerBankAccountNo}`}</TableCell></>
                                            : <>
                                                <TableCell></TableCell><TableCell></TableCell>
                                            </>}
                                    </TableRow>
                                )) : <TableRow><TableCell colSpan={6} align='center'><Typography>Incoming payment is empty</Typography></TableCell></TableRow>}
                            </>}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{ mt: 1 }}>
                <Button type='button' variant='contained' onClick={() => router.push('/sales-invoice')}>Back</Button>
            </Box>
            <Dialog fullWidth open={openCreateIncomingPaymentDialog} onClose={handleCloseCreateIncomingPaymentDialog}>

                <DialogTitle>{`Incoming Payment`}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Payment amount"
                        type="number"
                        fullWidth
                        variant='outlined'
                        size='small'
                        onChange={(evt) => handleSetPaymentAmount(evt.target.value)}
                        error={isPaymentExceeded}
                        helperText={isPaymentExceeded && `Payment amount is exceeding the invoice amount`}
                    />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}>
                        <FormControl sx={{ mt: 1, minWidth: 200, mr: 2 }} size="small">
                            <InputLabel id="demo-select-small">Payment Method</InputLabel>
                            <Select
                                value={incomingPaymentReq.paymentMethod}
                                defaultValue={incomingPaymentReq.paymentMethod}
                                label="Payment Method"
                                onChange={handleSelectPaymentMethod}
                            >
                                <MenuItem value="CASH">CASH</MenuItem>
                                <MenuItem value="TRANSFER">TRANSFER</MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Invoice Date"
                                value={incPaymentDate}
                                onChange={(newValue) => {
                                    setIncPaymentDate(newValue);
                                    setIncomingPaymentReq({ ...incomingPaymentReq, ipDate: dateFns.format(newValue, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX") });
                                }}
                                renderInput={(params) => <TextField {...params} size="small" margin='dense' />}
                            />
                        </LocalizationProvider>
                    </Box>
                    {incomingPaymentReq.paymentMethod === "TRANSFER" ?
                        <>
                            {/* <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                mt: 2
                            }}>
                                <Autocomplete
                                    freeSolo={true}
                                    disablePortal
                                    id="combo-box-demo"
                                    options={custBankAccountList}
                                    getOptionLabel={(option) => option.label}
                                    sx={{ width: 540 }}
                                    size='small'
                                    renderInput={(params) => <TextField {...params} label="Customer Bank Account" />}
                                    onChange={(evt, newValue) => {

                                        setIncomingPaymentReq({
                                            ...incomingPaymentReq,
                                            custBankAccountName: newValue.custBankAccountName,
                                            custBankAccountNo: newValue.custBankAccountNo,
                                            custBankName: newValue.custBankName,
                                            customerBankAccountId: newValue.customerBankAccountId,
                                        })
                                    }}
                                />
                                <IconButton onClick={(evt) => setOpenCreateCustomerBankDialog(true)}>
                                    <AddCircleOutlineRoundedIcon color='primary' />
                                </IconButton>
                            </Box> */}

                            <Box sx={{ mt: 2 }}>
                                <Autocomplete
                                    freeSolo={true}
                                    disablePortal
                                    id="combo-box-demo"
                                    options={ownerBankAccountList}
                                    getOptionLabel={(option) => option.label}
                                    sx={{ width: 550 }}
                                    size='small'
                                    renderInput={(params) => <TextField {...params} label="Receive Bank Account" />}
                                    onChange={(evt, newValue) => {

                                        setIncomingPaymentReq({
                                            ...incomingPaymentReq,
                                            ownerBankAccountName: newValue.ownerBankAccountName,
                                            ownerBankAccountNo: newValue.ownerBankAccountNo,
                                            ownerBankName: newValue.ownerBankName,
                                            ownerBankInfoId: newValue.ownerBankAccountId,
                                        });
                                    }}
                                />
                            </Box>
                        </>
                        : <></>}


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateIncomingPaymentDialog}>Cancel</Button>
                    <Button disabled={incomingPaymentReq.paymentAmount <= 0 || incomingPaymentReq.paymentMethod == ''} onClick={handleSaveIncomingPayment}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth open={openCreateCustomerBankDialog} onClose={handleCloseCreateCustomerBankDialog}>

                <DialogTitle>{`Customer Bank`}</DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{ mb: 1 }}
                        autoFocus
                        margin="dense"
                        label="Bank account name"
                        fullWidth
                        variant='outlined'
                        size='small'
                        onChange={(evt) => setCreateCustomerBankReq({ ...createCustomerBankReq, bankAccountName: evt.target.value })}
                    />
                    <TextField
                        sx={{ mb: 1 }}
                        margin="dense"
                        label="Bank account Number"
                        fullWidth
                        variant='outlined'
                        size='small'
                        onChange={(evt) => setCreateCustomerBankReq({ ...createCustomerBankReq, bankAccountNumber: evt.target.value })}
                    />
                    <Autocomplete
                        freeSolo={true}
                        disablePortal
                        id="combo-box-demo"
                        options={bankReferences}
                        getOptionLabel={(option) => option.label}
                        sx={{ width: 550 }}
                        size='small'
                        renderInput={(params) => <TextField {...params} label="Bank Reference" />}
                        onChange={(evt, newValue) => {
                            if (newValue) {
                                setCreateCustomerBankReq({
                                    ...createCustomerBankReq,
                                    bankRefId: newValue.bankRefId,
                                    bankName: newValue.label
                                });
                            }
                        }}
                    />


                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateCustomerBankDialog}>Cancel</Button>
                    <Button onClick={handleSaveCustomerBank}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

DetailInvoice.getLayout = function getLayout(page) {
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

export default DetailInvoice;