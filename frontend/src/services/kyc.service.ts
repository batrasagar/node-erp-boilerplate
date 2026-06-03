import api from './api';
import { KycSubmission } from '../types';

export interface KycFormData {
  businessName: string;
  businessType: string;
  registrationNumber?: string;
  taxNumber?: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  phone: string;
  website?: string;
}

export const kycService = {
  submit: async (data: KycFormData): Promise<KycSubmission> => {
    const { data: res } = await api.post('/kyc/submit', data);
    return res.data;
  },

  getStatus: async (): Promise<KycSubmission | null> => {
    const { data } = await api.get('/kyc/status');
    return data.data;
  },

  list: async (status?: string): Promise<(KycSubmission & { tenant: any })[]> => {
    const { data } = await api.get('/kyc', { params: status ? { status } : {} });
    return data.data;
  },

  pendingCount: async (): Promise<number> => {
    const { data } = await api.get('/kyc/pending-count');
    return data.data.count;
  },

  review: async (id: string, status: 'approved' | 'rejected' | 'under_review', rejectionReason?: string) => {
    const { data } = await api.put(`/kyc/${id}/review`, { status, rejectionReason });
    return data.data;
  },
};
