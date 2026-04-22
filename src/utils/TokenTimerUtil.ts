import { AuthUtil } from "./AuthUtil";
import { $tokenTimer } from "@/stores/tokenTimerStore";
export const TokenTimerUtil = {
  startTimer(tokenExpireAt: number, refreshTokenExpireAt: number) {
    this.stopTimer();

    const intervalId = window.setInterval(() => {
      const tokenTimer = $tokenTimer.get();
      if (!tokenTimer) return;

      //count down
      const newTokenTimeLeft = Math.max(
        Math.floor((tokenTimer.tokenExpireAt * 1000 - Date.now()) / 1000),
        0,
      );
      const newRefreshTokenTimeLeft = Math.max(
        Math.floor(
          (tokenTimer.refreshTokenExpireAt * 1000 - Date.now()) / 1000,
        ),
        0,
      );

      //refresh token is expired
      if (newRefreshTokenTimeLeft === 0) {
        this.stopTimer();
        AuthUtil.logout();
      } else {
        $tokenTimer.set({
          intervalId: tokenTimer.intervalId,
          tokenTimeLeft: newTokenTimeLeft,
          refreshTokenTimeLeft: newRefreshTokenTimeLeft,
          tokenExpireAt: tokenTimer.tokenExpireAt,
          refreshTokenExpireAt: tokenTimer.refreshTokenExpireAt,
        });
      }
    }, 1000);

    const tokenTimeLeft = Math.max(
      Math.floor((tokenExpireAt * 1000 - Date.now()) / 1000),
      0,
    );
    const refreshTokenTimeLeft = Math.max(
      Math.floor((refreshTokenExpireAt * 1000 - Date.now()) / 1000),
      0,
    );

    $tokenTimer.set({
      intervalId,
      tokenTimeLeft,
      refreshTokenTimeLeft,
      tokenExpireAt,
      refreshTokenExpireAt,
    });
  },

  stopTimer() {
    const tokenTimer = $tokenTimer.get();
    if (tokenTimer) clearInterval(tokenTimer.intervalId);
    $tokenTimer.set(null);
  },
};
