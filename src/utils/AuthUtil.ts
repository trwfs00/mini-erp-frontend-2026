import { router } from "@/router";
import { $authUser } from "@/stores/authUserStore";
import { $has401Error } from "@/stores/has401ErrorStore";
import { LocalStorageUtil } from "./LocalStorageUtil";
import { TokenTimerUtil } from "./TokenTimerUtil";

export const AuthUtil = {
  logout() {
    LocalStorageUtil.deleteAuthUser();
    TokenTimerUtil.stopTimer();
    $authUser.set(null);
    $has401Error.set(false);
    router.navigate("/");
  },
};
