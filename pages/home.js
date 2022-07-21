import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSession, signOut, getSession } from 'next-auth/react';
import Button from '@mui/material/Button';
import DashboardLayout from '../components/DashboardLayout';

const Home = () => {

    const session = useSession();

    const logout = () => {
        console.log("logout dong");
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

Home.getLayout = function getLayout(page) {
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

export default Home;