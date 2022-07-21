import * as React from 'react';
import Typography from '@mui/material/Typography';
import { getSession } from 'next-auth/react';
import DashboardLayout from '../../components/DashboardLayout';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
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
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';
import Alert from '@mui/material/Alert';

import { debounce } from 'lodash';
import { useForm, Controller } from 'react-hook-form';

import { useSelector, useDispatch } from 'react-redux';
import { searchUser, enableOrDisableUser, fetchAllRoles, createUser, resetCreateUserError, resetCreateUserResp } from '../../src/redux/slices/user-management-slice';

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

const Index = ({ session }) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchStr, setSearchStr] = React.useState('');
    const [openUserForm, setOpenUserForm] = React.useState(false);

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const { roles, users, enableOrDisableUserResp, createUserResp, createUserError } = useSelector((state) => state.userManagement);
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(searchUser({ token: session.accessToken, page: page, size: rowsPerPage, searchStr: searchStr }))
    }, [page, rowsPerPage, searchStr, session]);

    React.useEffect(() => {
        dispatch(fetchAllRoles(session.accessToken));
    }, [session]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEnableOrDisableUser = (evt, dat) => {
        dispatch(enableOrDisableUser({ profileId: dat.id, token: session.accessToken }))
    }

    const handleSearchUser = (evt) => {
        setSearchStr(evt.target.value);
    }

    const handleOpenUserForm = (evt) => {
        setOpenUserForm(true);
    }

    const handleCloseUserForm = (evt) => {
        reset({
            name: '',
            phone: '',
            email: '',
            address: '',
            username: '',
            password: '',
            roles: []
        });
        dispatch(resetCreateUserError());
        dispatch(resetCreateUserResp());
        dispatch(searchUser({ token: session.accessToken, page: page, size: rowsPerPage, searchStr: '' }))
        setOpenUserForm(false);
    }

    const onSaveUser = (params) => {
        const createUserReq = { ...params, token: session.accessToken };
        dispatch(createUser(createUserReq))
    }

    const debouncedSearchUser = React.useMemo(() => debounce(handleSearchUser, 300), []);

    return (
        <Box component={Paper} sx={{
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 1
            }}>
                <Box>
                    <TextField sx={{
                        width: 400,
                    }} label="Search" variant='outlined' size='small' onChange={debouncedSearchUser} />
                </Box>
                <Box>
                    <Button type='button' variant='contained' onClick={handleOpenUserForm}>Create User</Button>
                </Box>
            </Box>
            <TableContainer>

                <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Roles</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.data ? users.data.map(row => (
                            <TableRow key={row?.id}>
                                <TableCell>{row?.name}</TableCell>
                                <TableCell>{row?.phone}</TableCell>
                                <TableCell>{row?.email}</TableCell>
                                <TableCell>{row?.address}</TableCell>
                                <TableCell><Switch defaultChecked={row?.isEnabled} onChange={(evt) => handleEnableOrDisableUser(evt, row)} /></TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        {row?.roles.length > 0 ? row.roles.map((row) => (<Chip sx={{ fontSize: 10, fontWeight: 'medium' }} key={row} label={row} size='small' />))
                                            : ""}
                                    </Stack>
                                </TableCell>
                            </TableRow>))
                            :
                            <TableRow><TableCell colSpan={6} align='center'><Typography>User is empty</Typography></TableCell></TableRow>}

                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={6}
                                count={users?.totalRecords == undefined ? 0 : users?.totalRecords}
                                rowsPerPage={rowsPerPage}
                                page={users?.totalRecords == undefined ? 0 : page}
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
            <Dialog open={openUserForm} onClose={handleCloseUserForm} fullWidth>
                <form onSubmit={handleSubmit(onSaveUser)}>
                    <DialogTitle>User Form</DialogTitle>
                    {createUserError && <Alert severity='error'>Error create user</Alert>}
                    <DialogContent>
                        
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Controller name='name'
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Name should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Name"
                                    variant="outlined"
                                    error={errors.name?.type === 'required'}
                                    helperText={errors.name?.message}
                                />}
                            />
                            <Controller name='phone'
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Phone should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Phone"
                                    variant="outlined"
                                    error={errors.phone?.type === 'required'}
                                    helperText={errors.phone?.message}
                                />}
                            />
                            <Controller name='email'
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Email"
                                    variant="outlined"
                                />}
                            />
                            <Controller name='address'
                                control={control}
                                defaultValue=""
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Address"
                                    variant="outlined"
                                />}
                            />

                            <Typography fontWeight="500" sx={{ marginTop: 3 }}>User Access</Typography>
                            <Controller name='username'
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Username should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Username"
                                    variant="outlined"
                                    error={errors.username?.type === 'required'}
                                    helperText={errors.username?.message}
                                />}
                            />
                            <Controller name='password'
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Password should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth size="small"
                                    margin="dense"
                                    type="text"
                                    label="Password"
                                    variant="outlined"
                                    error={errors.password?.type === 'required'}
                                    helperText={errors.password?.message}
                                />}
                            />
                            <FormControl sx={{ width: 300, mb: 2, mt: 1 }} error={errors.userRoles?.type === 'required'}>
                                <InputLabel>Roles</InputLabel>
                                <Controller
                                    name="roles"
                                    control={control}
                                    defaultValue={[]}
                                    rules={{ required: 'Roles should not be empty' }}
                                    render={({ field }) => <Select {...field}
                                        multiple
                                        fullWidth
                                        size="small"
                                        margin="dense"
                                        input={<OutlinedInput label="Chip" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={value} size='small' sx={{ m: '2px' }} />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem
                                                key={role.id}
                                                value={role.roleName}
                                            >
                                                {role.roleName}
                                            </MenuItem>
                                        ))}
                                    </Select>}
                                />
                                {errors.userRoles?.type === 'required' && <FormHelperText>{errors.userRoles?.message}</FormHelperText>}
                            </FormControl>
                        </Box>

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseUserForm}>Cancel</Button>

                        <Button type='submit' variant='contained' disabled={createUserResp === null ? false : true}>Save</Button>
                    </DialogActions>
                </form>
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