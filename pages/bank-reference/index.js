import * as React from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/DashboardLayout';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import { useSelector, useDispatch } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
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
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import * as dateFns from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { debounce, set } from 'lodash';

import {
    createBankReference, fetchAllBankReference, updateBankReference,
    resetCreateBankRefResp
} from '../../src/redux/slices/bank-reference-slice';

const Index = ({ session }) => {

    const [openCreateBankDialog, setOpenCreateBankDialog] = React.useState(false);
    const [bankReferenceReq, setBankReferenceReq] = React.useState({
        bankName: '',
        bankCode: ''
    });
    const [isEditBankRef, setIsEditBankRef] = React.useState(false);

    const dispatch = useDispatch();

    const {
        createBankRefResp, updateBankRefResp, fetchBankRefResp
    } = useSelector((state) => state.bankReference);

    React.useEffect(() => {
        dispatch(fetchAllBankReference({ token: session.accessToken }))
    }, [createBankRefResp, updateBankRefResp, session]);

    const handleOpenCreateBankDialog = () => {
        setOpenCreateBankDialog(true);
    }

    const handleCloseCreateBankDialog = () => {
        setOpenCreateBankDialog(false);
        setBankReferenceReq({
            bankName: '',
            bankCode: ''
        });
    }

    const handleCreateBankReference = () => {
        if (isEditBankRef) {
            dispatch(updateBankReference({ bankRef: bankReferenceReq, token: session.accessToken }));
            setIsEditBankRef(!isEditBankRef);
        } else {
            dispatch(createBankReference({ bankRef: bankReferenceReq, token: session.accessToken }));
        }
        setOpenCreateBankDialog(false);
        setBankReferenceReq({
            bankName: '',
            bankCode: ''
        });
        dispatch(fetchAllBankReference({ token: session.accessToken }));
    }

    const handleEditBankReference = (_bankRef) => {
        setBankReferenceReq(_bankRef);
        setOpenCreateBankDialog(true);
        setIsEditBankRef(true);
    }

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Bank Reference</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: 1
            }}>
                <Button type="button" variant='contained' onClick={() => handleOpenCreateBankDialog()} >Create Bank Reference</Button>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Bank Name</TableCell>
                            <TableCell>Bank Code</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fetchBankRefResp?.length > 0 ? fetchBankRefResp.map(row => (
                            <TableRow key={row?.id}>
                                <TableCell>{row?.bankName}</TableCell>
                                <TableCell>{row?.bankCode}</TableCell>
                                <TableCell><Button onClick={() => handleEditBankReference(row)}>Edit</Button></TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={2} align='center'><Typography>Bank Reference is empty</Typography></TableCell></TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog fullWidth open={openCreateBankDialog} onClose={handleCloseCreateBankDialog}>

                <DialogTitle>{`Create Bank Reference`}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Bank name"
                        fullWidth
                        variant='outlined'
                        value={bankReferenceReq?.bankName}
                        onChange={(evt) => setBankReferenceReq({ ...bankReferenceReq, bankName: evt.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Bank code"
                        fullWidth
                        variant='outlined'
                        value={bankReferenceReq?.bankCode}
                        onChange={(evt) => setBankReferenceReq({ ...bankReferenceReq, bankCode: evt.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCreateBankDialog}>Cancel</Button>
                    <Button onClick={handleCreateBankReference}>Save</Button>
                </DialogActions>
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