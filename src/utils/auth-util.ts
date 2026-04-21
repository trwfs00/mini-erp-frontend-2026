import { router } from "@/router";
import { $authUser } from "@/stores/auth-user-store";
import { $has401Error } from "@/stores/has-401-error-store";
import { LocalStorageUtil } from "./local-storage-util";
import { TokenTimerUtil } from "./token-timer-util";

export const AuthUtil = {
  logout() {
    LocalStorageUtil.deleteAuthUser();
    TokenTimerUtil.stopTimer();
    $authUser.set(null);
    $has401Error.set(false);
    router.navigate("/");
  },
};
