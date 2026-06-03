import publicApi from './publicApi';
import { Plan, SignupPayload, SignupResponse } from '../types';

export const signupService = {
  getPlans: async (): Promise<Plan[]> => {
    const { data } = await publicApi.get('/public/plans');
    return data.data;
  },

  checkSlug: async (slug: string): Promise<boolean> => {
    const { data } = await publicApi.get(`/public/slug-check/${slug}`);
    return data.data.available;
  },

  signup: async (payload: SignupPayload): Promise<SignupResponse> => {
    const { data } = await publicApi.post('/public/signup', payload);
    return data.data;
  },
};
