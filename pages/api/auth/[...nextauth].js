import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as CONST from '../../../const';
import * as dateFns from 'date-fns';
import { current } from '@reduxjs/toolkit';

export default NextAuth({
    debug: true,
    secret: "XpCEmdiWk1WX91gh1XhE0hha59GFJ1LXpBoZCG+HzRU=",
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Username" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const authReq = { username: credentials.username, password: credentials.password };
                const authUrl = `${CONST.API_ENDPOINT}/user-management/authentication`;
                const authResp = await axios.post(authUrl, authReq, { headers: { 'Content-Type': 'application/json' } })
                    .then(resp => resp.data)
                    .catch(err => console.error(err));

                if (authResp) {
                    return authResp;
                }
                return null;
            },
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const decodedJwt = jwtDecode(user.payload.authToken)
            return decodedJwt.isEnabled;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, token, user }) {
            if (token) {
                const jwtToken = jwtDecode(token.accessToken);
                const expiredSession = new Date(jwtToken.exp * 1000);
                const currentDateTime = new Date();
                const isNotExpired = dateFns.isAfter(expiredSession, currentDateTime);
                if (isNotExpired) {
                    session.expires = dateFns.format(expiredSession, "yyyy-MM-dd'T'HH:mm:ss.SSS");
                    session.accessToken = token.accessToken;
                    session.id = jwtToken.profileId;
                    session.user = {
                        name: jwtToken?.username,
                        profileId: jwtToken?.profileId,
                        profileName: jwtToken?.profileName,
                        credentialId: jwtToken?.credentialId,
                        roles: jwtToken?.roles,
                        isEnabled: jwtToken?.isEnabled,
                    }
                }
            }
            console.log('session = ', session);
            return session;
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                const decodedJwt = jwtDecode(user.payload.authToken);
                token.name = decodedJwt.profileName;
                token.accessToken = user.payload.authToken;
            } else {
                const decodedJwt = jwtDecode(token.accessToken);
                const expiredSession = new Date(decodedJwt.exp * 1000);
                const currentDateTime = new Date();
                const isNotExpired = dateFns.isAfter(expiredSession, currentDateTime);
                if (!isNotExpired) {
                    return null;
                }
            }
            return token
        }
    },
    pages: {
        signIn: '/auth/signin'
    }
});