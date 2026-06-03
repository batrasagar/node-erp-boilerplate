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
};
