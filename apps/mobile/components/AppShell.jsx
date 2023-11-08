import {
  IonApp,
  IonLabel,
  IonRouterOutlet,
  setupIonicReact,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon
} from '@ionic/react';
import { cog, flash, list } from 'ionicons/icons';
import { StatusBar, Style } from '@capacitor/status-bar';
import { useEffect } from 'react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import { SessionProvider } from 'next-auth/react';

import Feed from './pages/Feed';
import Lists from './pages/Lists';
import ListDetail from './pages/ListDetail';
import Settings from './pages/Settings';
import Tabs from './pages/Tabs';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { App as CapApp } from '@capacitor/app';

setupIonicReact({});

window.matchMedia('(prefers-color-scheme: dark)').addListener(async status => {
  try {
    await StatusBar.setStyle({
      style: status.matches ? Style.Dark : Style.Light
    });
  } catch {}
});

const AUTH = {
  DOMAIN: 'dev-vjvp61sol8llnk53.us.auth0.com',
  CLIENT_ID: 'Sx0HLBh0Utw3mF18FmPUozigqb2bq8d8',
  CALLLBACK_NATIVE:
    'com.hwatucards.app://dev-vjvp61sol8llnk53.us.auth0.com/capacitor/com.hwatucards.app/callback'
};

const AppShell = () => {
  // Get the callback handler from the Auth0 React hook
  const { handleRedirectCallback } = useAuth0();

  useEffect(() => {
    // Handle the 'appUrlOpen' event and call `handleRedirectCallback`
    CapApp.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('state') && (url.includes('code') || url.includes('error'))) {
        await handleRedirectCallback(url);
      }
      // No-op on Android
      await Browser.close();
    });
  }, [handleRedirectCallback]);

  return (
    <IonApp>
      <Auth0Provider
        domain={AUTH.DOMAIN}
        clientId={AUTH.CLIENT_ID}
        useRefreshTokens={true}
        useRefreshTokensFallback={false}
        authorizationParams={{
          redirect_uri:
            'com.hwatucards.app://dev-vjvp61sol8llnk53.us.auth0.com/capacitor/com.hwatucards.app/callback'
        }}
      >
        <SessionProvider>
          <IonReactRouter>
            <IonRouterOutlet id="main">
              <Route path="/tabs" render={() => <Tabs />} />
              <Route path="/" render={() => <Redirect to="/tabs/feed" />} exact={true} />
            </IonRouterOutlet>
          </IonReactRouter>
        </SessionProvider>
      </Auth0Provider>
    </IonApp>
  );
};

export default AppShell;
