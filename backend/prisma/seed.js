const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed Services
  const services = [
    {
      title: 'Psicología clínica',
      description: 'Terapia individual, de pareja y familiar para tu bienestar emocional.',
      icon: 'brain',
      slug: 'psicologia-clinica',
    },
    {
      title: 'Odontología',
      description: 'Atención dental integral con enfoque en tu salud y estética.',
      icon: 'tooth',
      slug: 'odontologia',
    },
    {
      title: 'Terapias especializadas',
      description: 'Evaluaciones, orientación vocacional y terapias complementarias.',
      icon: 'therapy',
      slug: 'terapias-especializadas',
    },
    {
      title: 'Atención personalizada',
      description: 'Planes de tratamiento adaptados a tus necesidades y objetivos.',
      icon: 'heart',
      slug: 'atencion-personalizada',
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  // Seed Specialists
  const specialists = [
    {
      name: 'Lic. Aarón Chávez',
      role: 'Psicólogo Clínico',
      specialty: 'Psicología',
      phone: '4711-7609',
      bio: 'Especialista en terapia cognitivo-conductual con más de 10 años de experiencia.',
      image: '/assets/specialists/aaron.webp',
    },
    {
      name: 'Dra. Nohemí Argueta',
      role: 'Odontóloga',
      specialty: 'Odontología',
      phone: '4711-7609',
      bio: 'Especialista en odontología estética y restaurativa con enfoque en el bienestar del paciente.',
      image: '/assets/specialists/nohemi.webp',
    },
  ];

  for (const specialist of specialists) {
    await prisma.specialist.upsert({
      where: { id: specialists.indexOf(specialist) + 1 },
      update: {},
      create: specialist,
    });
  }

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
