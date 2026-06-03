export type PlanId = 'starter' | 'professional' | 'enterprise';

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  billing: 'free' | 'monthly';
  description: string;
  maxUsers: number;
  maxCompanies: number;
  maxBranches: number;
  features: string[];
  popular?: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0,
    billing: 'free',
    description: 'Perfect for small teams getting started',
    maxUsers: 5,
    maxCompanies: 1,
    maxBranches: 2,
    features: ['1 Company', '5 Users', '2 Branches', 'Role-Based Access', 'Audit Logs', 'Basic Support'],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 29,
    billing: 'monthly',
    description: 'For growing businesses with advanced needs',
    maxUsers: 50,
    maxCompanies: 5,
    maxBranches: 20,
    popular: true,
    features: ['5 Companies', '50 Users', 'File Uploads', 'Push Notifications', 'Advanced RBAC', 'Priority Email Support'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    billing: 'monthly',
    description: 'Unlimited scale for large organisations',
    maxUsers: -1,
    maxCompanies: -1,
    maxBranches: -1,
    features: ['Unlimited Companies', 'Unlimited Users', 'WhatsApp Integration', 'API Access', 'Custom Roles', 'Dedicated Support'],
  },
};
