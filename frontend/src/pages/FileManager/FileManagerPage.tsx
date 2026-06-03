import React, { useRef } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonIcon, IonFab, IonFabButton, IonRefresher, IonRefresherContent, IonAlert,
} from '@ionic/react';
import { cloudUploadOutline, documentOutline, imageOutline, trashOutline, add } from 'ionicons/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileService } from '../../services/role.service';
import { format } from 'date-fns';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { usePermission } from '../../hooks/usePermission';
import { useUIStore } from '../../stores/uiStore';

const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const FileManagerPage: React.FC = () => {
  const queryClient = useQueryClient();
  const canUpload = usePermission('files.create');
  const canDelete = usePermission('files.delete');
  const { showToast } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['files'],
    queryFn: () => fileService.list({ limit: 50 }),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: globalThis.File) => fileService.upload(file as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      showToast('File uploaded', 'success');
    },
    onError: () => showToast('Upload failed', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fileService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      showToast('File deleted', 'success');
    },
  });

  const files = data?.data || [];

  const getIcon = (mimeType: string) => mimeType.startsWith('image/') ? imageOutline : documentOutline;
  const getColor = (mimeType: string) => mimeType.startsWith('image/') ? '#34C759' : '#007AFF';

  return (
    <IonPage>
      <IonHeader translucent><IonToolbar><IonTitle>File Manager</IonTitle></IonToolbar></IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}><IonRefresherContent /></IonRefresher>
        <IonHeader collapse="condense"><IonToolbar style={{ '--background': 'transparent' }}><IonTitle size="large">Files</IonTitle></IonToolbar></IonHeader>

        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,.pdf,.csv"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMutation.mutate(f as any); }} />

        {isLoading ? <LoadingSkeleton count={6} /> : files.length === 0 ? (
          <EmptyState title="No Files" description="Upload files to get started" icon={cloudUploadOutline}
            actionLabel={canUpload ? 'Upload File' : undefined}
            onAction={() => fileInputRef.current?.click()} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {files.map((file: any) => (
                <IonItem key={file.id} style={{ '--background': '#fff' }}>
                  <div slot="start" style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${getColor(file.mimeType)}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <IonIcon icon={getIcon(file.mimeType)} style={{ fontSize: 20, color: getColor(file.mimeType) }} />
                  </div>
                  <IonLabel style={{ marginLeft: 8 }}>
                    <h3 style={{ fontWeight: 500, fontSize: 14 }}>{file.originalName}</h3>
                    <p style={{ fontSize: 12, color: '#8E8E93' }}>
                      {formatBytes(file.size)} • {format(new Date(file.createdAt), 'MMM d, yyyy')}
                    </p>
                  </IonLabel>
                  {canDelete && (
                    <IonIcon icon={trashOutline} slot="end" style={{ color: '#FF3B30', fontSize: 20 }}
                      onClick={() => setDeleteTarget(file.id)} />
                  )}
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        {canUpload && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        <IonAlert isOpen={!!deleteTarget} onDidDismiss={() => setDeleteTarget(null)}
          header="Delete File" message="Are you sure you want to delete this file?"
          buttons={[
            { text: 'Cancel', role: 'cancel' },
            { text: 'Delete', role: 'destructive', handler: () => { if (deleteTarget) deleteMutation.mutate(deleteTarget); } },
          ]} />
        <div style={{ height: 100 }} />
      </IonContent>
    </IonPage>
  );
};

export default FileManagerPage;
