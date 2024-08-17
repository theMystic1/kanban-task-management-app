import { auth } from "./app/services/auth";

export const middleware = auth;

export const config = {
  matcher: ["/", "/boards"],
};
