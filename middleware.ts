/** @format */

import { authConfig } from '@/auth/config';
import NextAuth from 'next-auth';
import { apiOpenRoutes, privateRoutes } from './routes';

const { auth } = NextAuth(authConfig);
export default auth(async (req) => {
	const isLoggedIn = !!req.auth;
	const { nextUrl } = req;
	const url = process.env.BASE_URL || 'http://localhost:3000';
	const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
	const isAuthRoute = nextUrl.pathname.includes('/auth');
	const isApiRoute =
		nextUrl.pathname.includes('/api') &&
		!apiOpenRoutes.includes(nextUrl.pathname);
	const isApiOpenRoute = apiOpenRoutes.includes(nextUrl.pathname);
	// const isOpenRoute = true;

	if (isApiOpenRoute) return;
	if (!isLoggedIn && isAuthRoute) return;
	if (isLoggedIn && (isApiRoute || isPrivateRoute)) return;
	if (isLoggedIn && isAuthRoute) return Response.redirect(`${url}/`);
	if (!isLoggedIn && (isPrivateRoute || isApiRoute))
		return Response.redirect(`${url}/auth/login`);
	return;
});

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
