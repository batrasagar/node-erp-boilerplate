import 'dotenv/config';
import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import { Tenant } from '../models/Tenant';
import { Company } from '../models/Company';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { Permission } from '../models/Permission';
import { RolePermission } from '../models/RolePermission';
import { UserRole } from '../models/UserRole';
import { KycSubmission } from '../models/KycSubmission';
import '../models/index';
import { hashPassword } from '../utils/password.util';

// ─── Permission sets per role ──────────────────────────────────────────────
const ROLE_PERMISSIONS: Record<string, string[][]> = {
  admin: [
    // All permissions — fetched dynamically
  ],
  support: [
    ['users', 'read'], ['users', 'create'], ['users', 'update'],
    ['notifications', 'read'], ['notifications', 'send'],
    ['dashboard', 'read'],
    ['companies', 'read'],
    ['branches', 'read'],
    ['departments', 'read'],
  ],
  sales: [
    ['companies', 'read'],
    ['branches', 'read'],
    ['departments', 'read'],
    ['dashboard', 'read'],
    ['notifications', 'read'],
  ],
  accounts: [
    ['companies', 'read'], ['companies', 'create'], ['companies', 'update'],
    ['approvals', 'read'], ['approvals', 'manage'],
    ['kyc', 'read'], ['kyc', 'review'],
    ['dashboard', 'read'],
    ['files', 'read'], ['files', 'create'], ['files', 'delete'],
    ['settings', 'read'],
    ['notifications', 'read'],
  ],
};

async function seed() {
  await sequelize.authenticate();
  console.log('✓ DB connected');

  // ── 1. Seed all permissions ──────────────────────────────────────────────
  const permDefs = [
    ...['tenants','companies','branches','departments','users','roles','menus'].flatMap(m =>
      ['create','read','update','delete'].map(a => ({ module: m, action: a, resource: m, description: `${a} ${m}` }))
    ),
    { module: 'permissions', action: 'read', resource: 'Permission', description: 'View permissions' },
    { module: 'permissions', action: 'assign', resource: 'Permission', description: 'Assign permissions' },
    { module: 'notifications', action: 'read', resource: 'Notification', description: 'View notifications' },
    { module: 'notifications', action: 'send', resource: 'Notification', description: 'Send notifications' },
    { module: 'audit_logs', action: 'read', resource: 'AuditLog', description: 'View audit logs' },
    { module: 'files', action: 'create', resource: 'File', description: 'Upload files' },
    { module: 'files', action: 'read', resource: 'File', description: 'View files' },
    { module: 'files', action: 'delete', resource: 'File', description: 'Delete files' },
    { module: 'settings', action: 'read', resource: 'Setting', description: 'View settings' },
    { module: 'settings', action: 'update', resource: 'Setting', description: 'Update settings' },
    { module: 'dashboard', action: 'read', resource: 'Dashboard', description: 'View dashboard' },
    { module: 'kyc', action: 'read', resource: 'KycSubmission', description: 'View KYC submissions' },
    { module: 'kyc', action: 'submit', resource: 'KycSubmission', description: 'Submit KYC' },
    { module: 'kyc', action: 'review', resource: 'KycSubmission', description: 'Review and approve KYC' },
    { module: 'approvals', action: 'read', resource: 'Approval', description: 'View approvals queue' },
    { module: 'approvals', action: 'manage', resource: 'Approval', description: 'Process approvals' },
  ];
  await Permission.bulkCreate(permDefs, { ignoreDuplicates: true });
  const allPerms = await Permission.findAll();
  console.log(`✓ ${allPerms.length} permissions in DB`);

  const permMap = new Map(allPerms.map(p => [`${p.module}.${p.action}`, p.id]));

  // ── 2. Create tenant ─────────────────────────────────────────────────────
  const [tenant, tenantCreated] = await Tenant.findOrCreate({
    where: { slug: 'curtina-tech' },
    defaults: {
      name: 'Curtina Tech Solutions',
      slug: 'curtina-tech',
      plan: 'enterprise',
      status: 'active',
      kycStatus: 'approved',
    },
  });
  console.log(`✓ Tenant: ${tenant.name} (${tenantCreated ? 'created' : 'exists'})`);

  // ── 3. Create KYC for the tenant ─────────────────────────────────────────
  await KycSubmission.findOrCreate({
    where: { tenantId: tenant.id },
    defaults: {
      tenantId: tenant.id,
      businessName: 'Curtina Tech Solutions Pvt Ltd',
      businessType: 'corporation',
      registrationNumber: 'CTS-2024-001',
      taxNumber: 'TAX-CTS-2024',
      address: '12th Floor, Curtina Tower, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400051',
      phone: '+91-22-4000-0000',
      website: 'https://curtina.tech',
      status: 'approved',
    },
  });

  // ── 4. Create 3 companies ────────────────────────────────────────────────
  const companies = [
    { name: 'Curtina Tech HQ', code: 'CTH', city: 'Mumbai', country: 'India', currency: 'INR', email: 'hq@curtina.tech' },
    { name: 'Curtina Logistics', code: 'CTL', city: 'Delhi', country: 'India', currency: 'INR', email: 'logistics@curtina.tech' },
    { name: 'Curtina Finance', code: 'CTF', city: 'Bengaluru', country: 'India', currency: 'INR', email: 'finance@curtina.tech' },
  ];
  for (const co of companies) {
    await Company.findOrCreate({
      where: { tenantId: tenant.id, code: co.code },
      defaults: { ...co, tenantId: tenant.id, status: 'active' },
    });
  }
  console.log('✓ 3 companies created');

  // ── 5. Create 4 roles ────────────────────────────────────────────────────
  const roleDefs = [
    { name: 'Admin',    slug: 'admin',    description: 'Full access to all modules' },
    { name: 'Support',  slug: 'support',  description: 'User management and support operations' },
    { name: 'Sales',    slug: 'sales',    description: 'Sales and company data access' },
    { name: 'Accounts', slug: 'accounts', description: 'Financial approvals and company management' },
  ];

  const roles: Record<string, Role> = {};
  for (const rd of roleDefs) {
    const [role] = await Role.findOrCreate({
      where: { tenantId: tenant.id, slug: rd.slug },
      defaults: { ...rd, tenantId: tenant.id, isSystem: true, status: 'active' },
    });
    roles[rd.slug] = role;
  }
  console.log('✓ 4 roles created');

  // ── 6. Assign permissions to roles ───────────────────────────────────────
  for (const [slug, permPairs] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roles[slug];
    if (!role) continue;

    let permIds: string[];
    if (slug === 'admin') {
      permIds = allPerms.map(p => p.id);
    } else {
      permIds = permPairs
        .map(([m, a]) => permMap.get(`${m}.${a}`))
        .filter(Boolean) as string[];
    }

    await RolePermission.destroy({ where: { roleId: role.id } });
    if (permIds.length) {
      await RolePermission.bulkCreate(
        permIds.map(permissionId => ({ roleId: role.id, permissionId })),
        { ignoreDuplicates: true },
      );
    }
    console.log(`  ✓ ${slug}: ${permIds.length} permissions`);
  }

  // ── 7. Create 4 users ────────────────────────────────────────────────────
  const password = await hashPassword('Curtina@123');
  const userDefs = [
    { firstName: 'Raj',    lastName: 'Sharma',   email: 'admin@curtina.tech',    roleSlug: 'admin',    isSuperAdmin: false },
    { firstName: 'Priya',  lastName: 'Nair',     email: 'support@curtina.tech',  roleSlug: 'support',  isSuperAdmin: false },
    { firstName: 'Arjun',  lastName: 'Mehta',    email: 'sales@curtina.tech',    roleSlug: 'sales',    isSuperAdmin: false },
    { firstName: 'Deepika',lastName: 'Iyer',     email: 'accounts@curtina.tech', roleSlug: 'accounts', isSuperAdmin: false },
  ];

  for (const ud of userDefs) {
    const [user, userCreated] = await User.findOrCreate({
      where: { email: ud.email, tenantId: tenant.id },
      defaults: {
        tenantId: tenant.id,
        firstName: ud.firstName,
        lastName: ud.lastName,
        email: ud.email,
        password,
        status: 'active',
        emailVerified: true,
        isSuperAdmin: ud.isSuperAdmin,
      },
    });

    const role = roles[ud.roleSlug];
    if (role) {
      await UserRole.findOrCreate({ where: { userId: user.id, roleId: role.id }, defaults: { userId: user.id, roleId: role.id } });
    }
    console.log(`  ✓ ${ud.email} (${userCreated ? 'created' : 'exists'})`);
  }

  console.log('\n─────────────────────────────────────────');
  console.log('  Curtina Tech Solutions seed complete');
  console.log('─────────────────────────────────────────');
  console.log('  Organisation : curtina-tech');
  console.log('  Password     : Curtina@123');
  console.log('  Users:');
  userDefs.forEach(u => console.log(`    ${u.email.padEnd(30)} [${u.roleSlug}]`));
  console.log('─────────────────────────────────────────\n');

  await sequelize.close();
}

seed().catch((err) => { console.error(err); process.exit(1); });
