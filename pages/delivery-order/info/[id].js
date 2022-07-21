import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../../components/DashboardLayout';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';

import TableRow from '@mui/material/TableRow';

import * as dateFns from 'date-fns';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useForm, Controller } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import {
    resetSearchDOReqError, resetSearchDOReqLoading, resetSearchDOReqResp, searchDORequest,
    getDORequest, resetGetDoRequestError, resetGetDoRequestLoding, resetGetDoRequestResp,
    createDo, getDoByDoReq, resetCreateDoError, resetCreateDoLoading, resetCreateDoResp, resetGetDoByDoReqError, resetGetDoByDoReqLoading,
    resetGetDoByDoReqResp, findDoById, resetFindDoByIdError, resetFindDoByIdLoading, resetFindDoByIdResp,
    setDoReceive, resetSetDoReceiveError, resetSetDoReceiveLoading, resetSetDoReceiveResp
} from '../../../src/redux/slices/delivery-order-slice';

const DoInfo = ({ session }) => {

    const router = useRouter();
    const { id } = router.query;

    const {
        getDoRequestResp,
        getDoRequestLoading,
        getDoRequestError,
        createDoLoading,
        createDoResp,
        createDoError,
        findDoByIdLoading,
        findDoByIdResp,
        findDoByIdError,
        setDoReceiveResp,
        setDoReceiveError,
        setDoReceiveLoading
    } = useSelector((state) => state.deliveryOrder);

    const { control: receiveDoControl,
        handleSubmit: receiveDoHandleSubmit,
        formState: { errors: receiveDoErrors },
        reset: receiveDoReset,
        setValue: receiveDoSetValue,
        getValues: receiveDoGetValues,
        register: receiveDoRegister } = useForm();

    const [openReceivedDoForm, setOpenReceivedDoForm] = React.useState(false);

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(findDoById({ doId: id, token: session.accessToken }))
        return () => {
            dispatch(resetFindDoByIdResp());
        };
    }, [id, session, setDoReceiveResp]);

    const handleOpenReceiveDoForm = () => {
        setOpenReceivedDoForm(true);
    }

    const handleCloseReceivedDoForm = () => {
        dispatch(resetSetDoReceiveResp());
        setOpenReceivedDoForm(false);
    }

    const onSaveReceiveDo = (data) => {
        const receivedDoReq = { ...data, doId: id, token: session.accessToken };
        console.log(receivedDoReq);
        dispatch(setDoReceive(receivedDoReq));
    }

    return (
        <Box>
            <Box component={Paper} sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', padding: 1 }}>
                    <Typography fontWeight={600} fontSize={20}>Delivery Order Info</Typography>
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
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Box sx={{ mr: 1 }}>
                            <TextField value={findDoByIdResp?.deliveryOrderRequest?.soNumber || ''} disabled label='SO Number' size='small' margin='dense' />
                        </Box>
                        <Box sx={{ mr: 1 }}>
                            <TextField value={findDoByIdResp?.doNumber || ''} disabled label='DO Number' size='small' margin='dense' />
                        </Box>
                        <Box>
                            <Chip label={findDoByIdResp?.doStatus} color='primary' size='small' sx={{ fontWeight: 500 }} />
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', minWidth: 230}}>
                        <Box>
                            <Button variant='contained' size='small' onClick={() => router.push('/delivery-order')}>Delivery Order</Button>
                        </Box>
                        <Box>
                            <Button variant='contained' size='small' onClick={handleOpenReceiveDoForm} disabled={findDoByIdResp?.doStatus == 'RECEIVED'}>Receive DO</Button>
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
                        mr: 8,
                    }}>
                        <Box sx={{
                            padding: 1
                        }}>
                            <Typography fontWeight={600}>Delivery Info</Typography>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Delivery Date</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.doDate != undefined ? dateFns.format(new Date(findDoByIdResp.doDate), "yyyy-MM-dd") : ""}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>From Warehouse</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.fromWarehouse}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Vehicle no</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.vehicleNo}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Delivery person</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.deliveryPerson}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Receiver</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.receiver}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        mr: 8,
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
                                <Typography>{findDoByIdResp?.deliveryOrderRequest?.customerName}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Customer phone</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.deliveryOrderRequest?.customerPhone}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Customer email</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.deliveryOrderRequest?.customerEmail}</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
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
                                <Typography>{findDoByIdResp?.deliveryOrderRequest?.shippingAddress}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Shipping Date</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.deliveryOrderRequest?.shippingDate != undefined ? dateFns.format(new Date(findDoByIdResp?.deliveryOrderRequest?.shippingDate), 'yyyy-MM-dd') : ""}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Shipping Cost</Typography>
                            </Box>
                            <Box>
                                <Typography>{findDoByIdResp?.deliveryOrderRequest?.shippingCost}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ padding: 1 }}>
                            <Box>
                                <Typography fontSize={14} fontWeight={500}>Customer Picked Up</Typography>
                            </Box>
                            <Box>
                                {findDoByIdResp?.deliveryOrderRequest?.customerPickedUp ? <Typography>True</Typography> : <Typography>False</Typography>}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
                <Table size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item name</TableCell>
                            <TableCell>Unit</TableCell>
                            <TableCell>Delivery Qty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {findDoByIdResp?.deliveryItems.length > 0 && (findDoByIdResp?.deliveryItems.map((itm, id) => (<TableRow key={itm.id}>
                            <TableCell>{itm.itemName}</TableCell>
                            <TableCell>{itm.itemUnit}</TableCell>
                            <TableCell>{itm.deliveryQty}</TableCell>
                        </TableRow>)))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={openReceivedDoForm} onClose={handleCloseReceivedDoForm}>
                <DialogTitle>Received Delivery Order</DialogTitle>
                <form onSubmit={receiveDoHandleSubmit(onSaveReceiveDo)}>
                    <DialogContent>
                        <Controller
                            name="receiver"
                            control={receiveDoControl}
                            defaultValue=""
                            rules={{ required: "Receiver cannot be empty" }}
                            render={({ field }) => (
                                <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Receiver name name"
                                    variant="outlined"
                                    error={receiveDoErrors.receiver?.type === 'required'}
                                    helperText={receiveDoErrors.receiver?.message}
                                />
                            )}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseReceivedDoForm}>Cancel</Button>

                        <Button type='submit' variant='contained' disabled={setDoReceiveResp !== null}>Save</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

DoInfo.getLayout = function getLayout(page) {
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

export default DoInfo;