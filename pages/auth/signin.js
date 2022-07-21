import React from 'react';
import {getSession, getCsrfToken, signIn} from 'next-auth/react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TypoGraphy from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useForm, Controller } from 'react-hook-form';

const SignIn = ({csrfToken}) => {

    const { register, handleSubmit, formState: { errors }, control } = useForm();

    const doLogin = (authParam) => {
        console.log(authParam);
        signIn('credentials', {username: authParam.username, password: authParam.password});
    }

    return(
    <Box sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center'
    }}>
        <Box sx={{
            display: 'flex',
            mt: 10
        }}>
            <Paper
                sx={{
                    p: 3,
                    height: 300
                }}
            >
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <TypoGraphy variant="h6">Sign In</TypoGraphy>
                </Box>
                <form noValidate onSubmit={handleSubmit(doLogin)}>
                <Box>

                            <Controller
                                name="username"
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

                        </Box>
                        <Box>
                            <Controller
                                name="password"
                                control={control}
                                defaultValue=""
                                rules={{ required: 'Password should not empty' }}
                                render={({ field }) => <TextField {...field}
                                    fullWidth
                                    size="small"
                                    margin="dense"
                                    type="password"
                                    label="Password"
                                    variant="outlined"
                                    error={errors.password?.type === 'required'}
                                    helperText={errors.password?.message}
                                />}
                            />
                        </Box>
                        <Box sx={{
                            mt: 1
                        }}>
                            <Button type="submit" variant="contained" fullWidth>Sign In</Button>
                        </Box>
                </form>
            </Paper>
        </Box>
    </Box>);
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    
    if (session) {
        return {
            redirect: {
                destination: '/home',
                permanent: false,
            }
        };
    }
    return {
        props: {
            csrfToken: await getCsrfToken(context)
        }
    };
}

export default SignIn;