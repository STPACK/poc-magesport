"use client";

import { LoginPage } from "./LoginPage";
import { withLoginPage } from "./withLoginPage";
import { withUnauthenGuard } from "@/hocs/withUnauthenGuard";

const ConnectedLoginPage = withUnauthenGuard(withLoginPage(LoginPage));

export { ConnectedLoginPage as LoginPage };
