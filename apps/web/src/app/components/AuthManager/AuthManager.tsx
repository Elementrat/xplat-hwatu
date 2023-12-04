"use client";
import React, { useContext } from "react";

import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Button } from "ux";
import strings from "./AuthManager.strings";
import styles from "./AuthManager.module.css";
import { CONSTANTS, UIContext } from "xplat-lib";
import { personCircleOutline } from "ionicons/icons";

const AuthManager = () => {
  const { data: session, status } = useSession();
  const { toggleProfileModal } = useContext(UIContext);

  const onProfileBtnClick = () => {
    toggleProfileModal(true);
  };

  return (
    <div className={styles.authManager}>
      {status === CONSTANTS.AUTHENTICATED ? (
        <div onClick={onProfileBtnClick}>
          <Button icon={personCircleOutline} label={session?.user?.name} />
        </div>
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
