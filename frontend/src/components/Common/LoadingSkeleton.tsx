import React from 'react';
import { IonSkeletonText, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/react';

interface LoadingSkeletonProps {
  count?: number;
  type?: 'list' | 'card' | 'stat';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 5, type = 'list' }) => {
  if (type === 'stat') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
            <IonSkeletonText animated style={{ width: '60%', height: 12, borderRadius: 6, marginBottom: 8 }} />
            <IonSkeletonText animated style={{ width: '80%', height: 28, borderRadius: 6 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <IonList style={{ margin: '0 16px', borderRadius: 16, overflow: 'hidden' }}>
      {Array.from({ length: count }).map((_, i) => (
        <IonItem key={i}>
          <IonAvatar slot="start">
            <IonSkeletonText animated />
          </IonAvatar>
          <IonLabel>
            <h3><IonSkeletonText animated style={{ width: '70%' }} /></h3>
            <p><IonSkeletonText animated style={{ width: '50%' }} /></p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default LoadingSkeleton;
