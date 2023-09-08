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
import { useForm, Controller } from 'react-hook-form';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import {
    searchSupplier, findSupplierWithPaging, createSupplier, resetFindSupplierWithPagingResp
} from '../../src/redux/slices/supplier-slice';



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

    return (
        <React.Fragment>

            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="right">{row.supplierName}</TableCell>
                <TableCell align="right">{row.supplierPhone}</TableCell>
                <TableCell align="right">{row.supplierEmail}</TableCell>
                <TableCell align="right">{row.supplierAddress}</TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const Index = ({ session }) => {
    const dispatch = useDispatch();

    const { findSupplierWithPagingResp, createSupplierResp } = useSelector((state) => state.supplier);
    const [openCreateSupplierForm, setOpenCreateSupplierForm] = React.useState(false);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { control: supplierControl,
        handleSubmit: supplierHandleSubmit,
        formState: { errors: supplierErrors },
        reset: supplierReset,
        setValue: supplierSetValue,
        getValues: supplierGetValues,
        register: supplierRegister } = useForm();

    React.useEffect(() => {
        dispatch(findSupplierWithPaging({ token: session.accessToken, page: page, size: rowsPerPage }));
    }, [page, rowsPerPage, createSupplierResp, session]);


    const handleOpenCreateSupplier = () => {
    
        setOpenCreateSupplierForm(true);
    }

    const handleCloseCreateSupplier = () => {
        setOpenCreateSupplierForm(false);
    }

    const onSaveSupplier = (params) => {
        dispatch(createSupplier({supplier: params, token: session.accessToken}))
        supplierReset();
    }

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', padding: 1 }}>
                <Typography fontWeight={600}>Supplier</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'end',
                alignItems: 'center',
                padding: 1
            }}>
                <Box>
                    <Button type='button' variant='contained' onClick={() => handleOpenCreateSupplier()}>Create Supplier</Button>
                </Box>
            </Box>
            <TableContainer>
                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" size='small'>
                    <TableHead>
                        <TableRow>
             
                            <TableCell align="right">Supplier Name</TableCell>
                            <TableCell align="right">Supplier Phone</TableCell>
                            <TableCell align="right">Supplier Email</TableCell>
                            <TableCell align="right">Supplier Address</TableCell>
                        </TableRow>
                    </TableHead>
                    {findSupplierWithPagingResp &&
                        <TableBody>
                            {(findSupplierWithPagingResp.data.length > 0) ? findSupplierWithPagingResp.data.map(row => (
                                <Row key={row?.id} row={row} />
                            )) :
                                <TableRow><TableCell colSpan={6} align='center'><Typography fontSize={'0.8rem'}>Supplier is empty</Typography></TableCell></TableRow>}
                        </TableBody>}
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={11}
                                count={findSupplierWithPagingResp?.totalRecords == undefined ? 0 : findSupplierWithPagingResp?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={findSupplierWithPagingResp?.totalRecords == undefined ? 0 : page}
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

            <Dialog id="master-item-form" open={openCreateSupplierForm} onClose={onSaveSupplier} fullWidth>
                <DialogTitle>Create Supplier Form</DialogTitle>
                <DialogContent>
                    <form onSubmit={supplierHandleSubmit(onSaveSupplier)}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='supplierName'
                                    control={supplierControl}
                                    defaultValue=""
                                    rules={{
                                        required: "supplier cannot be empty"
                                    }}
                                    render={({ field }) => <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        label="Supplier Name"
                                        variant="outlined"
                                        error={supplierErrors.supplierName !== undefined}
                                        helperText={supplierErrors?.supplierName?.message} />}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='supplierPhone'
                                    control={supplierControl}
                                    defaultValue=""
                                    rules={{
                                        required: "supplier cannot be empty"
                                    }}
                                    render={({ field }) => <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        label="Supplier Phone"
                                        variant="outlined"
                                        error={supplierErrors.supplierPhone !== undefined}
                                        helperText={supplierErrors?.supplierPhone?.message} />}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='supplierEmail'
                                    control={supplierControl}
                                    defaultValue=""
                                    render={({ field }) => <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        label="Supplier Email"
                                        variant="outlined"
                                        />}
                                />
                            </Box>
                            <Box sx={{
                                mt: 2
                            }}>
                                <Controller name='supplierAddress'
                                    control={supplierControl}
                                    defaultValue=""
                                    render={({ field }) => <TextField {...field}
                                        fullWidth size="small"
                                        margin="dense"
                                        label="Supplier address"
                                        variant="outlined"
                                    />}
                                />
                            </Box>
                            
                        </Box>
                        <DialogActions>
                            <Button onClick={handleCloseCreateSupplier}>Cancel</Button>

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