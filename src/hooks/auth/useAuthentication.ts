import { AuthenticationContext } from "@/providers/AuthenticationProvider";
import { useContext } from "react";

export function useAuthentication() {
  return useContext(AuthenticationContext);
}
