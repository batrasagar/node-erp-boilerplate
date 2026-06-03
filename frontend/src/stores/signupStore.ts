import { create } from 'zustand';
import { PlanId } from '../types';

interface SignupState {
  selectedPlan: PlanId | null;
  orgName: string;
  orgSlug: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  setPlan: (plan: PlanId) => void;
  setOrgDetails: (orgName: string, orgSlug: string) => void;
  setAccountDetails: (firstName: string, lastName: string, email: string, password: string) => void;
  reset: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  selectedPlan: null,
  orgName: '',
  orgSlug: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',

  setPlan: (selectedPlan) => set({ selectedPlan }),
  setOrgDetails: (orgName, orgSlug) => set({ orgName, orgSlug }),
  setAccountDetails: (firstName, lastName, email, password) => set({ firstName, lastName, email, password }),
  reset: () => set({ selectedPlan: null, orgName: '', orgSlug: '', firstName: '', lastName: '', email: '', password: '' }),
}));
