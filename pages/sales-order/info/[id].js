import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import DashboardLayout from '../../../components/DashboardLayout';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as dateFns from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';
import * as CONST from '../../../const';

import axios from 'axios';
import {
    findSOById, resetFindSOByIdError, resetFindSOByIdLoading, resetFindSOByIdResp, updateSODraftToOpen, cancelSOTransaction,
    resetCancelSOTransactionError
} from '../../../src/redux/slices/sales-order-slice';

const SoDraft = ({ session }) => {

    const router = useRouter();
    const { id } = router.query;

    const {
        findSOByIdLoading,
        findSOByIdResp,
        findSOByIdError,
        updateSODraftToOpenResp,
        updateSODraftToOpenError,
        cancelSOTransactionLoading,
        cancelSOTransactionResp,
        cancelSOTransactionError
    } = useSelector((state) => state.salesOrder);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(findSOById({ soId: id, token: session.accessToken }));
    }, [id, updateSODraftToOpenResp, cancelSOTransactionResp]);

    const updateSoToOpen = () => {
        dispatch(updateSODraftToOpen({ soId: id, token: session.accessToken }));
    }

    const cancelSo = () => {
        dispatch(cancelSOTransaction({ soId: id, token: session.accessToken }));
    }

    let numFormat = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        roundingMode: 'ceil',
    });

    const handleCloseCancelError = () => {
        dispatch(resetCancelSOTransactionError());
    }

    const handlePrintSO = async () => {
        const endpointUrl = `${CONST.API_ENDPOINT}/sales-management/so/pdf/${id}`;
        const printResp = await axios({
            url: endpointUrl,
            responseType: 'blob',
            headers: { 'Authorization': `Bearer ${session.accessToken}` }
        });
        const soPdf = new Blob([printResp.data], { type: 'application/pdf' });
        var blobURL = URL.createObjectURL(soPdf);

        var iframe = document.createElement('iframe'); //load content in an iframe to print later
        document.body.appendChild(iframe);

        iframe.style.display = 'none';
        iframe.src = blobURL;
        iframe.onload = function () {
            setTimeout(function () {
                iframe.focus();
                iframe.contentWindow.print();
            }, 1);
        };
    }


    return (
        <Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>

                <Box sx={{ display: 'flex', padding: 1 }}>
                    <Typography fontWeight={600} fontSize={20}>Sales Order Info</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    padding: 1,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <Box sx={{ mr: 1 }}>
                            <TextField value={findSOByIdResp?.soNumber || ''} disabled label='SO Number' size='small' margin='dense' />
                        </Box>
                        <Box sx={{ mr: 1 }}>
                            <TextField value={findSOByIdResp?.customerPoNumber || ''} disabled label='Customer PO Number' size='small' margin='dense' />
                        </Box>
                        <Box>
                            <Chip label={findSOByIdResp?.soStatus} color='primary' size='small' sx={{ fontWeight: 500 }} />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', minWidth: 190 }}>
                        <Box sx={{ mr: 1 }}>
                            <Button variant='contained' size='small' onClick={() => router.push('/sales-order')}>Back</Button>
                        </Box>
                        <Box sx={{ mr: 1 }}>
                            <Button variant='contained' size='small' onClick={updateSoToOpen} disabled={findSOByIdResp?.soStatus === 'OPEN' || findSOByIdResp?.soStatus === 'PARTIAL' || findSOByIdResp?.soStatus === 'CLOSED' || findSOByIdResp?.soStatus === 'CANCEL'}>Create SO</Button>
                        </Box>
                        <Box sx={{ mr: 1 }}>
                            <Button variant='contained' size='small' disabled={findSOByIdResp?.soStatus !== 'DRAFT' && findSOByIdResp?.soStatus !== 'OPEN'} onClick={() => router.push(`/sales-order/edit/${findSOByIdResp?.id}`)}>Edit SO</Button>
                        </Box>
                        <Box sx={{ mr: 1 }}>
                            <Button variant='contained' size='small' onClick={cancelSo} disabled={findSOByIdResp?.soStatus === 'PARTIAL' || findSOByIdResp?.soStatus === 'CLOSED' || findSOByIdResp?.soStatus === 'CANCEL'}>Cancel SO</Button>
                        </Box>
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
                            {findSOByIdResp?.salesOrderDetails.map((row, idx) =>
                                <TableRow key={idx}>
                                    <TableCell>{row.itemName}</TableCell>
                                    <TableCell>{row.itemCode}</TableCell>
                                    <TableCell>{row.itemUnit}</TableCell>
                                    <TableCell>{numFormat.format(row.inventoryQty)}</TableCell>
                                    <TableCell>{numFormat.format(row.itemPrice)}</TableCell>
                                    <TableCell>{numFormat.format(row.salesQty)}</TableCell>
                                    <TableCell>{row.itemDiscount}</TableCell>
                                    <TableCell>{numFormat.format(row.itemDiscountAmount)}</TableCell>
                                    <TableCell>{numFormat.format(row.amount)}</TableCell>
                                    <TableCell align='right'>{numFormat.format(row.total)}</TableCell>
                                </TableRow>)}
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Sub total</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{numFormat.format(findSOByIdResp?.totalAmount)}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={8}>
                                    <Typography fontSize={16} fontWeight={500}>Grand Discount</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{`${numFormat.format(findSOByIdResp?.grandDiscount)} %`}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{`${numFormat.format(findSOByIdResp?.grandDiscountAmount)}`}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Shipping Cost</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{numFormat.format(findSOByIdResp?.shippingCost)}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Tax</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{numFormat.format(findSOByIdResp?.taxAmount ? findSOByIdResp.taxAmount : 0)}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Grand Total</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{numFormat.format(findSOByIdResp?.afterTaxAmount)}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button variant='contained' size='small' disabled={findSOByIdResp?.soStatus == 'DRAFT'} onClick={handlePrintSO}>Print</Button>

            </Box>
            <Dialog
                open={cancelSOTransactionError !== null}
                onClose={handleCloseCancelError}
            >
                <DialogTitle id="alert-dialog-title">
                    {"Delivery order or sales invoice is proceeded"}
                </DialogTitle>

                <DialogActions>
                    <Button onClick={handleCloseCancelError} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>);
}


SoDraft.getLayout = function getLayout(page) {
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

export default SoDraft;