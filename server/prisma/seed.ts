import {
  PrismaClient,
  EventCategory,
  UserRole,
  EventStatus,
  AttendeeStatus,
} from "../src/generated/prisma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Hapus data lama
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

  // 2. Buat user
  const saltRounds = 10;
  const password = await bcrypt.hash("Password123!", saltRounds);

  const fixedOrganizer = await prisma.user.create({
    data: {
      email: "eo@example.com",
      password: password,
      fullName: "Captiera EO",
      role: UserRole.ORGANIZER,
      referralCode: faker.string.alphanumeric(8).toUpperCase(),
      profilePicture: faker.image.avatar(),
    },
  });

  const dummyUser = await prisma.user.create({
    data: {
      email: "user@example.com",
      password: password,
      fullName: "Captiera User",
      role: UserRole.CUSTOMER,
      referralCode: faker.string.alphanumeric(8).toUpperCase(),
      profilePicture: faker.image.avatar(),
    },
  });

  const organizers = [
    fixedOrganizer,
    ...(await Promise.all(
      Array.from({ length: 2 }).map(() =>
        prisma.user.create({
          data: {
            email: faker.internet.email().toLowerCase(),
            password,
            fullName: faker.company.name(),
            role: UserRole.ORGANIZER,
            referralCode: faker.string.alphanumeric(8).toUpperCase(),
            profilePicture: faker.image.avatar(),
          },
        })
      )
    )),
  ];

  console.log(`Created ${organizers.length} organizers. 🧑‍💼`);

  // 3. Buat event, ticket type, attendee, dan transaksi
  console.log("Creating events, ticket types, attendees, and transactions...");
  let globalIndex = 1;

  for (const organizer of organizers) {
    for (let i = 0; i < 5; i++) {
      const startDate = faker.date.future({ years: 0.5 });
      const totalSeats = faker.number.int({ min: 100, max: 500 });
      const basePrice = faker.helpers.arrayElement([0, 50000, 75000, 100000, 150000]);

      const event = await prisma.event.create({
        data: {
          organizerId: organizer.id,
          name: faker.music.songName() + ` ${faker.helpers.arrayElement(["Fest", "Live", "Show"])}`,
          description: faker.lorem.paragraphs(3),
          category: faker.helpers.arrayElement(Object.values(EventCategory)),
          location: faker.location.city(),
          startDate,
          endDate: new Date(startDate.getTime() + faker.number.int({ min: 2, max: 5 }) * 60 * 60 * 1000),
          basePrice,
          isFree: basePrice === 0,
          totalSeats,
          availableSeats: totalSeats,
          status: EventStatus.PUBLISHED,
          imageUrl: `https://picsum.photos/seed/event-${globalIndex}/1280/720`,
        },
      });

      const ticketType = await prisma.ticketType.create({
        data: {
          eventId: event.id,
          name: "Regular",
          price: event.basePrice,
          quantity: event.totalSeats,
        },
      });

      // ✅ Tambahkan attendees dan transaksi jika organizer-nya fixedOrganizer
      if (organizer.id === fixedOrganizer.id) {
        const attendeesCount = 8;

        for (let j = 0; j < attendeesCount; j++) {
          const fakeUser = await prisma.user.create({
            data: {
              email: faker.internet.email().toLowerCase(),
              password,
              fullName: faker.person.fullName(),
              role: UserRole.CUSTOMER,
              referralCode: faker.string.alphanumeric(8).toUpperCase(),
              profilePicture: faker.image.avatar(),
            },
          });

          const ticketQuantity = faker.number.int({ min: 1, max: 3 });
          const totalPricePaid = ticketQuantity * basePrice;

          await prisma.eventAttendee.create({
            data: {
              userId: fakeUser.id,
              eventId: event.id,
              ticketQuantity,
              totalPricePaid,
              status: faker.helpers.arrayElement(Object.values(AttendeeStatus)),
            },
          });

          await prisma.transaction.create({
            data: {
              customerId: fakeUser.id,
              eventId: event.id,
              ticketTypeId: ticketType.id,
              quantity: ticketQuantity,
              baseAmount: totalPricePaid,
              pointUsed: 0,
              voucherDiscount: 0,
              couponDiscount: 0,
              finalAmount: totalPricePaid,
              status: "PAID",
              paymentProof: faker.image.urlPicsumPhotos(),
              paymentDeadline: faker.date.soon(),
              confirmationDeadline: faker.date.soon({ days: 2 }),
            },
          });
        }
      }

      globalIndex++;
    }
  }

  console.log(`Seeding finished successfully. ✅`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });