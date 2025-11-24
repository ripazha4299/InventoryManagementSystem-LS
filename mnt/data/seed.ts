import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database (from /mnt/data/seed.ts)...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: {
      email: 'admin@college.edu',
      name: 'Club Admin',
      role: 'admin'
    }
  })

  // Add to allowlist
  await prisma.allowedEmail.upsert({
    where: { email: 'admin@college.edu' },
    update: {},
    create: { email: 'admin@college.edu', addedBy: admin.id }
  })

  // Sports
  const sports = ['Football','Cricket','Badminton','Basketball','TableTennis']
  const sportRecords: any[] = []
  for (const s of sports) {
    const rec = await prisma.sport.upsert({
      where: { name: s },
      update: {},
      create: { name: s }
    })
    sportRecords.push(rec)
  }

  // Holders (students)
  const holdersData = [
    { name: 'Alice Kumar', roll: 'CS101', contact: 'alice@example.edu' },
    { name: 'Bob Singh', roll: 'CS102', contact: 'bob@example.edu' },
    { name: 'Charlie Rao', roll: 'CS103', contact: 'charlie@example.edu' },
    { name: 'Deepa Nair', roll: 'CS104', contact: 'deepa@example.edu' },
    { name: 'Esha Patel', roll: 'CS105', contact: 'esha@example.edu' },
    { name: 'Farhan Ali', roll: 'CS106', contact: 'farhan@example.edu' },
    { name: 'Gita Sharma', roll: 'CS107', contact: 'gita@example.edu' },
    { name: 'Harish Verma', roll: 'CS108', contact: 'harish@example.edu' }
  ]

  const holderRecords: any[] = []
  for (const h of holdersData) {
    const rec = await prisma.holder.upsert({
      where: { roll: h.roll },
      update: {},
      create: h
    })
    holderRecords.push(rec)
  }

  // Create 20 sample products across sports
  const sampleProducts: any[] = []
  for (let i = 1; i <= 20; i++) {
    const sport = sportRecords[i % sportRecords.length]
    const withPerson = i % 4 === 0 // every 4th product is WITH_PERSON
    const currentHolder = withPerson ? holderRecords[i % holderRecords.length] : null

    const product = await prisma.product.create({
      data: {
        name: `${sport.name} Item ${i}`,
        sport: { connect: { id: sport.id } },
        dateAdded: new Date(),
        status: withPerson ? 'WITH_PERSON' : 'INVENTORY',
        currentHolder: withPerson ? { connect: { id: currentHolder.id } } : undefined,
        createdBy: { connect: { id: admin.id } },
        notes: `Seeded product ${i}`
      }
    })

    sampleProducts.push(product)

    // Add a couple of history entries per product
    await prisma.productHistory.create({
      data: {
        product: { connect: { id: product.id } },
        action: 'ADDED',
        byUser: { connect: { id: admin.id } },
        notes: 'Initial seed add'
      }
    })

    if (withPerson) {
      await prisma.productHistory.create({
        data: {
          product: { connect: { id: product.id } },
          action: 'ISSUED',
          holder: { connect: { id: currentHolder.id } },
          byUser: { connect: { id: admin.id } },
          notes: 'Issued during seed'
        }
      })
    }
  }

  // Create an inventory key and a couple of handovers
  const key = await prisma.inventoryKey.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      keyName: 'Main Room Key',
      lastUpdated: new Date()
    }
  })

  await prisma.keyHistory.create({
    data: {
      key: { connect: { id: key.id } },
      toHolder: { connect: { id: holderRecords[0].id } },
      byUser: { connect: { id: admin.id } },
      notes: 'Seed handover'
    }
  })

  console.log('Seeding complete')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
