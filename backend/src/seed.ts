import 'dotenv/config';
import { sequelize } from './config/database';
import { Tenant } from './models/Tenant';
import { User } from './models/User';
import './models/index';
import { hashPassword } from './utils/password.util';

async function seed() {
  await sequelize.authenticate();

  const [tenant] = await Tenant.findOrCreate({
    where: { slug: 'default' },
    defaults: {
      name: 'Default Tenant',
      slug: 'default',
      plan: 'enterprise',
      status: 'active',
    },
  });

  console.log(`Tenant: ${tenant.name} (id: ${tenant.id})`);

  const password = await hashPassword('admin123');

  const [user, created] = await User.findOrCreate({
    where: { email: 'admin@demo.com', tenantId: tenant.id },
    defaults: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@demo.com',
      password,
      tenantId: tenant.id,
      status: 'active',
      emailVerified: true,
      isSuperAdmin: true,
    },
  });

  console.log(`User: ${user.email} (${created ? 'created' : 'already exists'})`);
  console.log('\nLogin credentials:');
  console.log('  Email:    admin@demo.com');
  console.log('  Password: admin123');
  console.log(`  Tenant:   ${tenant.id}`);

  await sequelize.close();
}

seed().catch((err) => { console.error(err); process.exit(1); });
