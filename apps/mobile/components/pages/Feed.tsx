import Image from 'next/image';
import Card from '../ui/Card';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton
} from '@ionic/react';
import Notifications from './Notifications';
import { useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { getHomeItems } from '../../store/selectors';
import Store from '../../store';
import { UserCards } from 'ux';
import { InputCard } from 'ux';

const Feed = () => {
  const homeItems = Store.useState(getHomeItems);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Feed</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>11:42?</div>
        <UserCards />
        <InputCard />

        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
      </IonContent>
    </IonPage>
  );
};

export default Feed;
