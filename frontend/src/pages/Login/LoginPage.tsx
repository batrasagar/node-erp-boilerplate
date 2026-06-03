import React from 'react';
import {
  IonPage, IonContent, IonInput, IonButton, IonIcon,
  IonSpinner, IonInputPasswordToggle,
} from '@ionic/react';
import { lockClosedOutline } from 'ionicons/icons';
import { useForm, Controller } from 'react-hook-form';
import { useLogin } from '../../hooks/useAuth';
import { useTenantStore } from '../../stores/tenantStore';

interface LoginForm {
  email: string;
  password: string;
  tenantSlug: string;
}

const LoginPage: React.FC = () => {
  const { mutate: login, isPending } = useLogin();
  const { setTenant } = useTenantStore();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '', tenantSlug: '' },
  });

  const onSubmit = (data: LoginForm) => {
    setTenant({ id: data.tenantSlug, slug: data.tenantSlug } as any);
    login({ email: data.email, password: data.password });
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        {/* Full-screen centered wrapper */}
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F2F2F7',
          padding: '24px',
          boxSizing: 'border-box',
        }}>
          {/* Max-width container */}
          <div style={{ width: '100%', maxWidth: 800 }}>

            {/* Logo & Title */}
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 22,
                background: '#007AFF', margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)',
              }}>
                <IonIcon icon={lockClosedOutline} style={{ fontSize: 36, color: '#fff' }} />
              </div>
              <h1 style={{
                fontSize: 34, fontWeight: 700, color: '#000',
                letterSpacing: 0.37, margin: '0 0 8px',
              }}>Welcome Back</h1>
              <p style={{ fontSize: 17, color: '#6C6C70', margin: 0 }}>Sign in to continue</p>
            </div>

            {/* Form Card */}
            <div style={{
              background: '#fff', borderRadius: 20,
              padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            }}>
              {/* Tenant Slug */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: '#6C6C70', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  Organization
                </label>
                <Controller
                  name="tenantSlug"
                  control={control}
                  rules={{ required: 'Organization is required' }}
                  render={({ field }) => (
                    <IonInput
                      {...field}
                      onIonInput={(e) => field.onChange(e.detail.value)}
                      placeholder="your-organization"
                      fill="outline"
                      style={{ '--border-radius': '10px' }}
                    />
                  )}
                />
                {errors.tenantSlug && (
                  <p style={{ fontSize: 12, color: '#FF3B30', margin: '4px 0 0' }}>{errors.tenantSlug.message}</p>
                )}
              </div>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, color: '#6C6C70', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  Email
                </label>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } }}
                  render={({ field }) => (
                    <IonInput
                      {...field}
                      type="email"
                      onIonInput={(e) => field.onChange(e.detail.value)}
                      placeholder="you@example.com"
                      fill="outline"
                      style={{ '--border-radius': '10px' }}
                    />
                  )}
                />
                {errors.email && (
                  <p style={{ fontSize: 12, color: '#FF3B30', margin: '4px 0 0' }}>{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div style={{ marginBottom: 28 }}>
                <label style={{ fontSize: 13, color: '#6C6C70', fontWeight: 500, display: 'block', marginBottom: 6 }}>
                  Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
                  render={({ field }) => (
                    <IonInput
                      {...field}
                      type="password"
                      onIonInput={(e) => field.onChange(e.detail.value)}
                      placeholder="••••••••"
                      fill="outline"
                      style={{ '--border-radius': '10px' }}
                    >
                      <IonInputPasswordToggle slot="end" />
                    </IonInput>
                  )}
                />
                {errors.password && (
                  <p style={{ fontSize: 12, color: '#FF3B30', margin: '4px 0 0' }}>{errors.password.message}</p>
                )}
              </div>

              <IonButton
                expand="block"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                style={{ '--border-radius': '12px', height: 50, fontSize: 17, fontWeight: 600 }}
              >
                {isPending ? <IonSpinner name="crescent" /> : 'Sign In'}
              </IonButton>

              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <a href="/forgot-password" style={{ color: '#007AFF', fontSize: 15, textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              </div>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
