import {
  PrismaClient,
  RoleName,
  LeadStatus,
  OpportunityStage,
  PermissionModule,
  PermissionAction,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const roles = await Promise.all(
    Object.values(RoleName).map(async (roleName) =>
      prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: {
          name: roleName,
          description: `${roleName.replace('_', ' ')} access level`,
        },
      }),
    ),
  );

  const roleMap = new Map(roles.map((role) => [role.name, role]));

  const permissions: Array<{ module: PermissionModule; action: PermissionAction }> = [
    { module: 'USERS', action: 'MANAGE' },
    { module: 'LEADS', action: 'MANAGE' },
    { module: 'CONTACTS', action: 'MANAGE' },
    { module: 'COMPANIES', action: 'MANAGE' },
    { module: 'OPPORTUNITIES', action: 'MANAGE' },
    { module: 'TASKS', action: 'MANAGE' },
    { module: 'FOLLOW_UPS', action: 'MANAGE' },
    { module: 'NOTES', action: 'MANAGE' },
    { module: 'CALENDAR', action: 'MANAGE' },
    { module: 'DOCUMENTS', action: 'MANAGE' },
    { module: 'COMMUNICATIONS', action: 'MANAGE' },
    { module: 'DASHBOARD', action: 'READ' },
    { module: 'REPORTS', action: 'READ' },
    { module: 'SETTINGS', action: 'READ' },
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { module_action: { module: permission.module, action: permission.action } },
      update: {},
      create: permission,
    });
  }

  const superAdminPassword = await bcrypt.hash('password123', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'superadmin@codexcrm.local' },
      update: {},
      create: {
        name: 'System Super Admin',
        email: 'superadmin@codexcrm.local',
        passwordHash: superAdminPassword,
        roleId: roleMap.get(RoleName.SUPER_ADMIN)!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'admin@codexcrm.local' },
      update: {},
      create: {
        name: 'Operations Admin',
        email: 'admin@codexcrm.local',
        passwordHash: superAdminPassword,
        roleId: roleMap.get(RoleName.ADMIN)!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'manager@codexcrm.local' },
      update: {},
      create: {
        name: 'Sales Manager',
        email: 'manager@codexcrm.local',
        passwordHash: superAdminPassword,
        roleId: roleMap.get(RoleName.MANAGER)!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sales@codexcrm.local' },
      update: {},
      create: {
        name: 'Alicia Sales',
        email: 'sales@codexcrm.local',
        passwordHash: superAdminPassword,
        roleId: roleMap.get(RoleName.SALES_EXECUTIVE)!.id,
      },
    }),
    prisma.user.upsert({
      where: { email: 'support@codexcrm.local' },
      update: {},
      create: {
        name: 'Support Desk',
        email: 'support@codexcrm.local',
        passwordHash: superAdminPassword,
        roleId: roleMap.get(RoleName.SUPPORT_USER)!.id,
      },
    }),
  ]);

  const company = await prisma.company.upsert({
    where: { id: 'company-demo-1' },
    update: {},
    create: {
      id: 'company-demo-1',
      name: 'Northstar Labs',
      website: 'https://northstarlabs.example',
      industry: 'SaaS',
      phone: '+1-415-555-0100',
      email: 'hello@northstarlabs.example',
      city: 'San Francisco',
      country: 'USA',
    },
  });

  const lead = await prisma.lead.upsert({
    where: { id: 'lead-demo-1' },
    update: {},
    create: {
      id: 'lead-demo-1',
      firstName: 'Sophia',
      lastName: 'Nguyen',
      email: 'sophia.nguyen@example.com',
      phone: '+1-415-555-0142',
      companyName: 'Northstar Labs',
      source: 'Website',
      status: LeadStatus.QUALIFIED,
      score: 86,
      assignedToId: users[3].id,
      companyId: company.id,
    },
  });

  const contact = await prisma.contact.upsert({
    where: { id: 'contact-demo-1' },
    update: {},
    create: {
      id: 'contact-demo-1',
      firstName: 'Sophia',
      lastName: 'Nguyen',
      email: 'sophia.nguyen@example.com',
      phone: '+1-415-555-0142',
      title: 'VP of Operations',
      companyId: company.id,
    },
  });

  const opportunity = await prisma.opportunity.upsert({
    where: { id: 'opportunity-demo-1' },
    update: {},
    create: {
      id: 'opportunity-demo-1',
      name: 'Northstar Expansion',
      amount: 24000,
      stage: OpportunityStage.NEGOTIATION,
      probability: 72,
      assignedToId: users[3].id,
      contactId: contact.id,
      companyId: company.id,
      leadId: lead.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Prepare proposal deck',
        description: 'Update pricing for the expansion package',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedToId: users[3].id,
        leadId: lead.id,
        contactId: contact.id,
        opportunityId: opportunity.id,
      },
    ],
  });

  const communication = await prisma.communication.create({
    data: {
      channel: 'EMAIL',
      direction: 'OUTBOUND',
      subject: 'Follow-up on expansion scope',
      body: 'Hi Sophia, thanks again for meeting with our team. Here is the proposal deck for review.',
      status: 'SENT',
      sentAt: new Date(),
      contactId: contact.id,
      leadId: lead.id,
      createdById: users[3].id,
    },
  });

  await prisma.email.create({
    data: {
      communicationId: communication.id,
      provider: 'mock',
      messageId: 'email-demo-1',
      fromAddress: 'team@codexcrm.local',
      toAddress: 'sophia.nguyen@example.com',
    },
  });

  await prisma.note.create({
    data: {
      content: 'Customer values flexibility and fast onboarding. Recommend phased rollout.',
      userId: users[3].id,
      leadId: lead.id,
      contactId: contact.id,
    },
  });

  await prisma.activity.create({
    data: {
      type: 'EMAIL_SENT',
      description: 'Proposal email sent to Sophia Nguyen',
      entityType: 'Lead',
      entityId: lead.id,
      userId: users[3].id,
      contactId: contact.id,
      leadId: lead.id,
      opportunityId: opportunity.id,
    },
  });

  console.log('Database seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
