import React from 'react';
import { IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { trendingUpOutline, trendingDownOutline } from 'ionicons/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: string;
  color?: string;
  trend?: number;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color = '#007AFF', trend, onClick }) => (
  <IonCard
    onClick={onClick}
    style={{
      margin: 0,
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      cursor: onClick ? 'pointer' : 'default',
    }}
  >
    <IonCardContent style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: '#6C6C70', margin: '0 0 6px', fontWeight: 500 }}>{title}</p>
          <p style={{ fontSize: 28, fontWeight: 700, color: '#000', margin: 0, letterSpacing: -0.5 }}>{value}</p>
          {subtitle && (
            <p style={{ fontSize: 12, color: '#8E8E93', margin: '4px 0 0' }}>{subtitle}</p>
          )}
          {trend !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 6 }}>
              <IonIcon
                icon={trend >= 0 ? trendingUpOutline : trendingDownOutline}
                style={{ color: trend >= 0 ? '#34C759' : '#FF3B30', fontSize: 14 }}
              />
              <span style={{ fontSize: 12, color: trend >= 0 ? '#34C759' : '#FF3B30', fontWeight: 600 }}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${color}20`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <IonIcon icon={icon} style={{ fontSize: 22, color }} />
          </div>
        )}
      </div>
    </IonCardContent>
  </IonCard>
);

export default StatCard;
