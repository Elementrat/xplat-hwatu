"use client";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "ux";
import strings from "./AuthManager.strings";
import styles from "./AuthManager.module.css";
import { CONSTANTS } from "xplat-lib";
import { personCircleOutline } from "ionicons/icons";

const AuthManager = () => {
  const { data: session, status } = useSession();
  return (
    <div className={styles.authManager}>
      {status === CONSTANTS.AUTHENTICATED ? (
        <>
          <Button
            icon={personCircleOutline}
            onClick={() => {
              signOut();
            }}
          />
          <div className={styles.userName}>{session?.user?.name}</div>
        </>
      ) : (
        <Button
          onClick={() => {
            signIn();
          }}
          label={strings.SIGN_IN}
          icon={personCircleOutline}
        />
      )}
    </div>
  );
};

export default AuthManager;
