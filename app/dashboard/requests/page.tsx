import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { undoRequest } from "@/actions/organizations";

export default async function requestsList() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  const requests = await prisma.joinRequest.findMany({
    where: {
      userId: userId,
    },

    include: {
      organization: true,
    },
  });

  return (
    <>
      <h1>Your Sent Requests</h1>

      {requests.length > 0 ? (

          requests.map((request) => (
            <div
              className="border p-3 mt-5 flex justify-between items-center"
              key={request.id}
            >
              <div>
                <div>{request.organization.name}</div>
                <div>Sent at : {request.createdAt.toLocaleDateString()}</div>
              </div>
              <form action={undoRequest}>
                <input name="id" type="hidden" value={request.id} />
                <button className="mx-3 hover:underline" type="submit">Undo</button>
              </form>
            </div>
          ))


      ):
      
      (<h2 className="mt-5">No requests</h2>)
      
      }
    </>
  );
}
