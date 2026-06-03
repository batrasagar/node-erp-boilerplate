import React, { useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption, IonSpinner,
} from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useHistory } from 'react-router-dom';
import { tenantService } from '../../services/tenant.service';
import { useUIStore } from '../../stores/uiStore';
import { Tenant } from '../../types';

const TenantFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const history = useHistory();
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  const { control, handleSubmit, reset } = useForm<Partial<Tenant>>({
    defaultValues: { name: '', slug: '', plan: 'starter', status: 'trial', primaryColor: '#007AFF' },
  });

  const { data: tenant } = useQuery({
    queryKey: ['tenants', id],
    queryFn: () => tenantService.get(id!),
    enabled: isEdit,
  });

  useEffect(() => { if (tenant) reset(tenant); }, [tenant, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<Tenant>) =>
      isEdit ? tenantService.update(id!, data) : tenantService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] });
      showToast(isEdit ? 'Tenant updated' : 'Tenant created', 'success');
      history.goBack();
    },
    onError: () => showToast('Failed to save tenant', 'error'),
  });

  const itemStyle = { '--background': '#fff', '--padding-start': '16px' };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/app/tenants" /></IonButtons>
          <IonTitle>{isEdit ? 'Edit Tenant' : 'New Tenant'}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSubmit((d) => mutation.mutate(d))} strong disabled={mutation.isPending}>
              {mutation.isPending ? <IonSpinner name="crescent" /> : 'Save'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ margin: '20px 16px 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <IonList style={{ background: 'transparent' }}>
            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Organization Name *</IonLabel>
              <Controller name="name" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <IonInput {...field} onIonInput={(e) => field.onChange(e.detail.value)} placeholder="Acme Corp" />
                )} />
            </IonItem>
            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Slug *</IonLabel>
              <Controller name="slug" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <IonInput {...field} onIonInput={(e) => field.onChange(e.detail.value)} placeholder="acme-corp" />
                )} />
            </IonItem>
            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Plan</IonLabel>
              <Controller name="plan" control={control}
                render={({ field }) => (
                  <IonSelect {...field} onIonChange={(e) => field.onChange(e.detail.value)} interface="action-sheet">
                    <IonSelectOption value="starter">Starter</IonSelectOption>
                    <IonSelectOption value="professional">Professional</IonSelectOption>
                    <IonSelectOption value="enterprise">Enterprise</IonSelectOption>
                  </IonSelect>
                )} />
            </IonItem>
            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Status</IonLabel>
              <Controller name="status" control={control}
                render={({ field }) => (
                  <IonSelect {...field} onIonChange={(e) => field.onChange(e.detail.value)} interface="action-sheet">
                    <IonSelectOption value="trial">Trial</IonSelectOption>
                    <IonSelectOption value="active">Active</IonSelectOption>
                    <IonSelectOption value="inactive">Inactive</IonSelectOption>
                    <IonSelectOption value="suspended">Suspended</IonSelectOption>
                  </IonSelect>
                )} />
            </IonItem>
            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Custom Domain</IonLabel>
              <Controller name="domain" control={control}
                render={({ field }) => (
                  <IonInput {...field} onIonInput={(e) => field.onChange(e.detail.value)} placeholder="app.acmecorp.com" />
                )} />
            </IonItem>
          </IonList>
        </div>
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default TenantFormPage;
