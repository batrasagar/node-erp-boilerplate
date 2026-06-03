import React from 'react';
import { IonIcon, IonButton } from '@ionic/react';
import { folderOpenOutline } from 'ionicons/icons';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, actionLabel, onAction }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '60px 32px', textAlign: 'center',
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: 20,
      background: '#F2F2F7', display: 'flex',
      alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    }}>
      <IonIcon icon={icon || folderOpenOutline} style={{ fontSize: 36, color: '#8E8E93' }} />
    </div>
    <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', margin: '0 0 8px' }}>{title}</h3>
    {description && (
      <p style={{ fontSize: 15, color: '#6C6C70', margin: '0 0 24px', lineHeight: 1.5 }}>{description}</p>
    )}
    {actionLabel && onAction && (
      <IonButton onClick={onAction} shape="round">
        {actionLabel}
      </IonButton>
    )}
  </div>
);

export default EmptyState;
