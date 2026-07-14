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

export const config = {
	matcher: ["/((?!_next/static|_next/image).*)"],
};
