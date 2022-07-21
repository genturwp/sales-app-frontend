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

import { useSelector, useDispatch } from 'react-redux';

import {
    findSOById, resetFindSOByIdError, resetFindSOByIdLoading, resetFindSOByIdResp, updateSODraftToOpen
} from '../../../src/redux/slices/sales-order-slice';

const SoDraft = ({ session }) => {

    const router = useRouter();
    const { id } = router.query;

    const {
        findSOByIdLoading,
        findSOByIdResp,
        findSOByIdError,
        updateSODraftToOpenResp,
        updateSODraftToOpenError
    } = useSelector((state) => state.salesOrder);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(findSOById({ soId: id, token: session.accessToken }));
    }, [id, updateSODraftToOpenResp]);

    const updateSoToOpen = () => {
        dispatch(updateSODraftToOpen({ soId: id, token: session.accessToken }));
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
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: 210}}>
                        <Box>
                            <Button variant='contained' size='small' onClick={() => router.push('/sales-order')}>Sales Order</Button>
                        </Box>
                        <Box>
                            <Button variant='contained' size='small' onClick={updateSoToOpen} disabled={findSOByIdResp?.soStatus === 'OPEN'}>Create SO</Button>
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
                                <Typography>{findSOByIdResp?.shippingDate}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Shipping Cost</Typography>
                            </Box>
                            <Box>
                                <Typography>{findSOByIdResp?.shippingCost}</Typography>
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
                                <Typography>{findSOByIdResp?.paymentDueDate}</Typography>
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
                                    <Typography fontSize={14} fontWeight={500} align='right'>{findSOByIdResp?.totalAmount}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={8}>
                                    <Typography fontSize={16} fontWeight={500}>Grand Discount</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{`${findSOByIdResp?.grandDiscount} %`}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{`${findSOByIdResp?.grandDiscountAmount}`}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Shipping Cost</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{findSOByIdResp?.shippingCost}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Tax</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{findSOByIdResp?.taxAmount}</Typography>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell align='right' colSpan={9}>
                                    <Typography fontSize={16} fontWeight={500}>Grand Total</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography fontSize={14} fontWeight={500} align='right'>{findSOByIdResp?.afterTaxAmount}</Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
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