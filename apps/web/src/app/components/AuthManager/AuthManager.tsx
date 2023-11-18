"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "ux";
import strings from "./AuthManager.strings";
import styles from "./AuthManager.module.css";
import { CONSTANTS } from "xplat-lib";

const AuthManager = () => {
  const { data: session, status } = useSession();
  return (
    <div className={styles.authManager}>
      {status === CONSTANTS.AUTHENTICATED ? (
        <>
          <div
            className={styles.userName}
            onClick={() => {
              signOut();
            }}
          >
            {session?.user?.name}
          </div>
        </>
      ) : (
        <Button
          onClick={() => {
            signIn();
          }}
          label={strings.SIGN_IN}
        />
      )}
    </div>
  );
};

export default AuthManager;
