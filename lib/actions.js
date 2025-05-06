// "use server";

// import { revalidatePath } from "next/cache";
// import prisma from "./db";
// import { convertPrismaTripToTripData } from "./prisma-types";

// // Get all trips
// export async function getTrips() {
//   const trips = await prisma.trip.findMany({
//     include: {
//       members: true,
//     },
//     orderBy: {
//       startDate: "asc",
//     },
//   });

//   return trips.map((trip) => ({
//     id: trip.id,
//     name: trip.name,
//     destination: trip.destination,
//     startDate: trip.startDate.toISOString().split("T")[0],
//     endDate: trip.endDate.toISOString().split("T")[0],
//     description: trip.description || undefined,
//     members: trip?.members.map((member) => ({
//       id: member.id,
//       name: member.name,
//       email: member.email || undefined,
//     })),
//   }));
// }

// // Get a single trip with all relations
// export async function getTrip(id) {
//   const trip = await prisma.trip.findUnique({
//     where: { id },
//     include: {
//       members: true,
//       expenses: {
//         include: {
//           paidBy: true,
//           splitWith: {
//             include: {
//               member: true,
//             },
//           },
//           repaidBy: {
//             include: {
//               member: true,
//             },
//           },
//         },
//       },
//       checklist: {
//         include: {
//           assignedTo: true,
//         },
//       },
//       timeline: true,
//       locations: true,
//       polls: {
//         include: {
//           options: {
//             include: {
//               votes: {
//                 include: {
//                   member: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!trip) return null;

//   return convertPrismaTripToTripData(trip);
// }

// // Create a new trip
// export async function createTrip(tripData) {
//   const { members, ...tripInfo } = tripData;

//   const trip = await prisma.trip.create({
//     data: {
//       name: tripInfo.name,
//       destination: tripInfo.destination,
//       startDate: new Date(tripInfo.startDate),
//       endDate: new Date(tripInfo.endDate),
//       description: tripInfo.description,
//       members: {
//         create: members.map((member) => ({
//           name: member.name,
//           email: member.email,
//         })),
//       },
//     },
//     include: {
//       members: true,
//     },
//   });

//   revalidatePath("/trips");
//   return trip.id;
// }

// // Update an expense
// export async function updateExpense(tripId, expenseId, data) {
//   // First, update the expense basic info
//   await prisma.expense.update({
//     where: { id: expenseId },
//     data: {
//       title: data.title,
//       amount: data.amount !== undefined ? data.amount : undefined,
//       category: data.category,
//       paidById: data.paidById,
//     },
//   });

//   // If splitWith is provided, update the expense splits
//   if (data.splitWith) {
//     // Delete existing splits
//     await prisma.expenseSplit.deleteMany({
//       where: { expenseId },
//     });

//     // Create new splits
//     await Promise.all(
//       data.splitWith.map((memberId) =>
//         prisma.expenseSplit.create({
//           data: {
//             expenseId,
//             memberId,
//           },
//         })
//       )
//     );
//   }

//   // If repaidBy is provided, update the expense repayments
//   if (data.repaidBy) {
//     // Delete existing repayments
//     await prisma.expenseRepayment.deleteMany({
//       where: { expenseId },
//     });

//     // Create new repayments
//     await Promise.all(
//       data.repaidBy.map((memberId) =>
//         prisma.expenseRepayment.create({
//           data: {
//             expenseId,
//             memberId,
//           },
//         })
//       )
//     );
//   }

//   revalidatePath(`/trips/${tripId}`);
// }

// // Toggle a timeline point completion status
// export async function toggleTimelinePointCompletion(
//   tripId,
//   pointId,
//   completed
// ) {
//   await prisma.timelinePoint.update({
//     where: { id: pointId },
//     data: { completed },
//   });

//   revalidatePath(`/trips/${tripId}`);
// }

// // Add a vote to a poll option
// export async function addPollVote(tripId, optionId, memberId) {
//   // First check if the member has already voted for this option
//   const existingVote = await prisma.pollOptionVote.findFirst({
//     where: {
//       optionId,
//       memberId,
//     },
//   });

//   if (!existingVote) {
//     // Find the poll this option belongs to
//     const option = await prisma.pollOption.findUnique({
//       where: { id: optionId },
//       include: { poll: true },
//     });

//     if (!option) return;

//     // Remove any existing votes by this member for other options in this poll
//     await prisma.pollOptionVote.deleteMany({
//       where: {
//         memberId,
//         option: {
//           pollId: option.pollId,
//         },
//       },
//     });

//     // Add the new vote
//     await prisma.pollOptionVote.create({
//       data: {
//         optionId,
//         memberId,
//       },
//     });

//     revalidatePath(`/trips/${tripId}`);
//   }
// }
