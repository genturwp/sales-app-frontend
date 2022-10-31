import * as React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { signOut, getSession } from 'next-auth/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Index = ({ session }) => {

    const logout = () => {
        signOut();
    }

    return (
        <Box>
            <Typography>Ini cuma test home</Typography>
            {console.log(session)}
            <Button variant='contained' onClick={() => logout()}>Logout</Button>
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