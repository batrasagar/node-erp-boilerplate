import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButtons, IonButton,
  IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonModal,
  IonInput, IonSelect, IonSelectOption, IonSpinner,
} from '@ionic/react';
import { add, businessOutline, chevronForwardOutline, close } from 'ionicons/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { companyService } from '../../services/company.service';
import { Company } from '../../types';
import LoadingSkeleton from '../../components/Common/LoadingSkeleton';
import EmptyState from '../../components/Common/EmptyState';
import { usePermission } from '../../hooks/usePermission';
import { useUIStore } from '../../stores/uiStore';

const CompaniesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const canCreate = usePermission('companies.create');
  const { showToast } = useUIStore();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: () => companyService.list(),
  });

  const { control, handleSubmit, reset } = useForm<Partial<Company>>({
    defaultValues: { name: '', code: '', email: '', phone: '', status: 'active' },
  });

  const mutation = useMutation({
    mutationFn: (payload: Partial<Company>) =>
      editing ? companyService.update(editing.id, payload) : companyService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      showToast(editing ? 'Company updated' : 'Company created', 'success');
      setShowModal(false);
      reset();
      setEditing(null);
    },
    onError: () => showToast('Failed to save company', 'error'),
  });

  const companies = (data?.data || []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openEdit = (company: Company) => {
    setEditing(company);
    reset({ name: company.name, code: company.code, email: company.email, phone: company.phone, status: company.status });
    setShowModal(true);
  };

  const itemStyle = { '--background': '#fff', '--padding-start': '16px' };

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Companies</IonTitle>
          {canCreate && (
            <IonButtons slot="end">
              <IonButton onClick={() => { setEditing(null); reset(); setShowModal(true); }} strong>
                <IonIcon icon={add} slot="icon-only" />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar value={search} onIonInput={(e) => setSearch(e.detail.value || '')} placeholder="Search companies..." animated />
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={(e) => { refetch(); e.detail.complete(); }}>
          <IonRefresherContent />
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar style={{ '--background': 'transparent' }}>
            <IonTitle size="large">Companies</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isLoading ? <LoadingSkeleton count={5} /> : companies.length === 0 ? (
          <EmptyState title="No Companies" icon={businessOutline}
            actionLabel={canCreate ? 'Add Company' : undefined}
            onAction={() => setShowModal(true)} />
        ) : (
          <div style={{ margin: '16px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <IonList style={{ background: 'transparent' }}>
              {companies.map((co) => (
                <IonItem key={co.id} button detail={false} onClick={() => openEdit(co)} style={{ '--background': '#fff' }}>
                  <div slot="start" style={{
                    width: 40, height: 40, borderRadius: 10, background: '#007AFF20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontWeight: 700, color: '#007AFF', fontSize: 16 }}>{co.name[0]}</span>
                  </div>
                  <IonLabel style={{ marginLeft: 8 }}>
                    <h3 style={{ fontWeight: 600 }}>{co.name}</h3>
                    <p>{co.code} {co.city ? `• ${co.city}` : ''}</p>
                  </IonLabel>
                  <div slot="end" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <IonBadge color={co.status === 'active' ? 'success' : 'medium'} style={{ fontSize: 11 }}>{co.status}</IonBadge>
                    <IonIcon icon={chevronForwardOutline} style={{ color: '#C7C7CC', fontSize: 16 }} />
                  </div>
                </IonItem>
              ))}
            </IonList>
          </div>
        )}

        <IonModal isOpen={showModal} onDidDismiss={() => { setShowModal(false); setEditing(null); }}
          breakpoints={[0, 0.75, 1]} initialBreakpoint={0.75}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{editing ? 'Edit Company' : 'New Company'}</IonTitle>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowModal(false)}><IonIcon icon={close} /></IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton onClick={handleSubmit((d) => mutation.mutate(d))} strong disabled={mutation.isPending}>
                  {mutation.isPending ? <IonSpinner name="crescent" /> : 'Save'}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <div style={{ padding: '16px' }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <IonList style={{ background: 'transparent' }}>
                  {[
                    { name: 'name' as const, label: 'Company Name *', placeholder: 'Acme Corp' },
                    { name: 'code' as const, label: 'Code *', placeholder: 'ACME' },
                    { name: 'email' as const, label: 'Email', placeholder: 'info@acme.com', type: 'email' },
                    { name: 'phone' as const, label: 'Phone', placeholder: '+1 234 567 8900', type: 'tel' },
                  ].map((f) => (
                    <IonItem key={f.name} style={itemStyle}>
                      <IonLabel position="stacked">{f.label}</IonLabel>
                      <Controller name={f.name} control={control}
                        render={({ field }) => (
                          <IonInput {...field} type={(f as any).type || 'text'}
                            onIonInput={(e) => field.onChange(e.detail.value)} placeholder={f.placeholder} />
                        )} />
                    </IonItem>
                  ))}
                  <IonItem style={itemStyle}>
                    <IonLabel position="stacked">Status</IonLabel>
                    <Controller name="status" control={control}
                      render={({ field }) => (
                        <IonSelect {...field} onIonChange={(e) => field.onChange(e.detail.value)} interface="action-sheet">
                          <IonSelectOption value="active">Active</IonSelectOption>
                          <IonSelectOption value="inactive">Inactive</IonSelectOption>
                        </IonSelect>
                      )} />
                  </IonItem>
                </IonList>
              </div>
            </div>
          </IonContent>
        </IonModal>
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default CompaniesPage;
