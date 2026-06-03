import React, { useEffect } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonButton, IonList, IonItem, IonLabel, IonInput, IonSelect, IonSelectOption,
  IonSpinner, IonNote,
} from '@ionic/react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useHistory } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { roleService } from '../../services/role.service';
import { companyService } from '../../services/company.service';
import { useUIStore } from '../../stores/uiStore';

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  roleIds: string[];
  companyId: string;
}

const UserFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const history = useHistory();
  const queryClient = useQueryClient();
  const { showToast } = useUIStore();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', status: 'active', roleIds: [], companyId: '' },
  });

  const { data: roles } = useQuery({ queryKey: ['roles'], queryFn: roleService.list });
  const { data: companies } = useQuery({ queryKey: ['companies'], queryFn: () => companyService.list() });

  const { data: user } = useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.get(id!),
    enabled: isEdit,
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        status: user.status,
        roleIds: user.roles?.map((r) => r.id) || [],
        companyId: user.companyId || '',
      });
    }
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: UserForm) =>
      isEdit ? userService.update(id!, data as any) : userService.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast(isEdit ? 'User updated' : 'User created', 'success');
      history.goBack();
    },
    onError: (error: unknown) => {
      showToast((error as any)?.response?.data?.message || 'Failed to save user', 'error');
    },
  });

  const itemStyle = { '--background': '#fff', '--padding-start': '16px' };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/app/users" />
          </IonButtons>
          <IonTitle>{isEdit ? 'Edit User' : 'New User'}</IonTitle>
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
              <IonLabel position="stacked">First Name *</IonLabel>
              <Controller name="firstName" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <IonInput {...field} onIonInput={(e) => field.onChange(e.detail.value)} placeholder="First name" />
                )} />
              {errors.firstName && <IonNote color="danger">Required</IonNote>}
            </IonItem>

            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Last Name *</IonLabel>
              <Controller name="lastName" control={control} rules={{ required: true }}
                render={({ field }) => (
                  <IonInput {...field} onIonInput={(e) => field.onChange(e.detail.value)} placeholder="Last name" />
                )} />
              {errors.lastName && <IonNote color="danger">Required</IonNote>}
            </IonItem>

            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Email *</IonLabel>
              <Controller name="email" control={control} rules={{ required: true, pattern: /^\S+@\S+\.\S+$/ }}
                render={({ field }) => (
                  <IonInput {...field} type="email" onIonInput={(e) => field.onChange(e.detail.value)} placeholder="email@example.com" />
                )} />
              {errors.email && <IonNote color="danger">Valid email required</IonNote>}
            </IonItem>

            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Phone</IonLabel>
              <Controller name="phone" control={control}
                render={({ field }) => (
                  <IonInput {...field} type="tel" onIonInput={(e) => field.onChange(e.detail.value)} placeholder="+1 234 567 8900" />
                )} />
            </IonItem>

            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Status</IonLabel>
              <Controller name="status" control={control}
                render={({ field }) => (
                  <IonSelect {...field} onIonChange={(e) => field.onChange(e.detail.value)} interface="action-sheet">
                    <IonSelectOption value="active">Active</IonSelectOption>
                    <IonSelectOption value="inactive">Inactive</IonSelectOption>
                    <IonSelectOption value="suspended">Suspended</IonSelectOption>
                  </IonSelect>
                )} />
            </IonItem>

            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Company</IonLabel>
              <Controller name="companyId" control={control}
                render={({ field }) => (
                  <IonSelect {...field} onIonChange={(e) => field.onChange(e.detail.value)} interface="action-sheet" placeholder="Select company">
                    {(companies?.data || []).map((c) => (
                      <IonSelectOption key={c.id} value={c.id}>{c.name}</IonSelectOption>
                    ))}
                  </IonSelect>
                )} />
            </IonItem>

            <IonItem style={itemStyle}>
              <IonLabel position="stacked">Roles</IonLabel>
              <Controller name="roleIds" control={control}
                render={({ field }) => (
                  <IonSelect {...field} onIonChange={(e) => field.onChange(e.detail.value)} multiple interface="alert" placeholder="Select roles">
                    {(roles?.data || []).map((r) => (
                      <IonSelectOption key={r.id} value={r.id}>{r.name}</IonSelectOption>
                    ))}
                  </IonSelect>
                )} />
            </IonItem>
          </IonList>
        </div>
        <div style={{ height: 40 }} />
      </IonContent>
    </IonPage>
  );
};

export default UserFormPage;
