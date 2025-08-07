import {
  PrismaClient,
  EventCategory,
  UserRole,
  EventStatus,
} from "../src/generated/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Membersihkan data lama dengan urutan yang benar
  console.log("Cleaning old data...");
  await prisma.review.deleteMany();
  await prisma.pointHistory.deleteMany();
  await prisma.eventAttendee.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  console.log("Old data cleaned. 🧼");

  // 2. Membuat Users
  const saltRounds = 10;
  const password = await bcrypt.hash("Password123!", saltRounds);

  const organizers = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          password: password,
          fullName: faker.company.name(),
          role: UserRole.ORGANIZER,
          referralCode: faker.string.alphanumeric(8).toUpperCase(),
          profilePicture: faker.image.avatar(),
        },
      })
    )
  );

  console.log(`Created ${organizers.length} organizers. 🧑‍💼`);

  // 3. Membuat Events dan TicketTypes untuk setiap Organizer
  console.log("Creating events and ticket types...");
  for (const organizer of organizers) {
    for (let i = 0; i < 5; i++) {
      const startDate = faker.date.future({ years: 0.5 });
      const totalSeats = faker.number.int({ min: 100, max: 500 }); // Sesuai skema: totalSeats
      const basePrice = faker.helpers.arrayElement([
        0, 50000, 75000, 100000, 150000,
      ]);

      const event = await prisma.event.create({
        data: {
          organizerId: organizer.id,
          name:
            faker.music.songName() +
            ` ${faker.helpers.arrayElement(["Fest", "Live", "Show"])}`,
          description: faker.lorem.paragraphs(3),
          category: faker.helpers.arrayElement(Object.values(EventCategory)),
          location: faker.location.city(),
          startDate: startDate,
          endDate: new Date(
            startDate.getTime() +
              faker.number.int({ min: 2, max: 5 }) * 60 * 60 * 1000
          ),
          basePrice: basePrice,
          isFree: basePrice === 0,
          totalSeats: totalSeats,
          availableSeats: totalSeats,
          status: EventStatus.PUBLISHED,
          imageUrl: `https://picsum.photos/1280/720?random=${faker.number.int({ min: 1, max: 1000 })}`,
        },
      });

      // Membuat TicketType untuk event ini
      await prisma.ticketType.create({
        data: {
          eventId: event.id,
          name: "Regular",
          price: event.basePrice,
          quantity: event.totalSeats,
        },
      });
    }
  }
  console.log(`Created events and tickets. 🎪`);
  console.log("Seeding finished. ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
