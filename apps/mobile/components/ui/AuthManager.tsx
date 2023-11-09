import { useAuth0 } from '@auth0/auth0-react';
import { Browser } from '@capacitor/browser';
import { IonButton } from '@ionic/react';

const AuthManager: React.FC = () => {
  const { loginWithRedirect, user, isLoading, logout } = useAuth0();

  // This should reflect the URL added earlier to your "Allowed Logout URLs" setting
  // in the Auth0 dashboard.
  const logoutUri = 'http://localhost:3001';

  const login = async () => {
    await loginWithRedirect({
      async openUrl(url) {
        // Redirect using Capacitor's Browser plugin
        await Browser.open({
          url,
          windowName: '_self'
        });
      }
    });
  };

  const doLogout = async () => {
    await logout({
      logoutParams: {
        returnTo: logoutUri
      },
      async openUrl(url) {
        // Redirect using Capacitor's Browser plugin
        await Browser.open({
          url,
          windowName: '_self'
        });
      }
    });
  };

  return user ? (
    <div>
      <IonButton onClick={doLogout}>Log out</IonButton>
      <span>name:{user?.name}</span>
      <span>email:{user?.email}</span>
    </div>
  ) : (
    <div>
      <IonButton onClick={login}>Log in</IonButton>
    </div>
  );
};

export default AuthManager;
