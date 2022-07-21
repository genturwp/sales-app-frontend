import * as React from 'react';
import { getSession } from 'next-auth/react';


export default function Index({ session }) {


  return (
    <></>
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
    redirect: {
      destination: '/home',
      permanent: false,
    }
  };
};