import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/i18n/config";

const publicFile = /\.[^/]+$/;

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasLocale = locales.some(({ code }) => pathname === `/${code}` || pathname.startsWith(`/${code}/`));

	if (hasLocale || pathname.startsWith("/studio") || pathname.startsWith("/api") || publicFile.test(pathname)) {
		return NextResponse.next();
	}

	const url = request.nextUrl.clone();
	url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
	return NextResponse.redirect(url);
}

// Every `/_next` route belongs to the framework, not to the locale scheme:
// besides /_next/static and /_next/image there is /_next/webpack-hmr, which has
// no file extension and so fell through to the redirect below and broke hot
// reload. Excluding the whole prefix is both narrower in intent and safer.
export const config = {
	matcher: ["/((?!_next).*)"],
};
