import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function localReply(message: string) {
  const text = message.toLowerCase();
  if (/price|cost|budget|estimate/.test(text)) {
    return "Software engagements typically start with a discovery call and scoped estimate. You can use the project estimator on the AI Products page or ask me to connect you with the team.";
  }
  if (/course|training|learn|student/.test(text)) {
    return "We currently offer Java Full Stack, React & Next.js, and Applied AI Engineering programs. Each includes projects, mentorship, and placement preparation.";
  }
  if (/placement|job|resume|interview/.test(text)) {
    return "Placement support includes ATS resume work, mock interviews, job-search planning, and AI-assisted interview practice.";
  }
  if (/portal|login|account/.test(text)) {
    return "Clients and students can use the Portal link in the navigation. Choose your role, then sign in or create an account.";
  }
  if (/human|call|contact|sales/.test(text)) {
    return "I can help start that conversation. Use the Contact page or Book a call button and the team will respond within one business day.";
  }
  return "I can help with software services, AI products, training, placements, pricing, or portal access. What outcome are you working toward?";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const conversationId =
      typeof body.conversationId === "string" ? body.conversationId : undefined;
    const visitorId = typeof body.visitorId === "string" ? body.visitorId : undefined;

    if (message.length < 2 || message.length > 2000) {
      return Response.json({ error: "Enter a message between 2 and 2,000 characters." }, { status: 400 });
    }

    const session = await getSession();
    const conversation = conversationId
      ? await prisma.conversation.findUnique({ where: { id: conversationId } })
      : await prisma.conversation.create({
          data: { userId: session?.userId, visitorId },
        });

    if (!conversation) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    await prisma.chatMessage.create({
      data: { conversationId: conversation.id, role: "user", content: message },
    });

    let reply = localReply(message);
    if (process.env.AI_CHAT_ENDPOINT && process.env.AI_CHAT_API_KEY) {
      const response = await fetch(process.env.AI_CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_CHAT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          system:
            "You are MRTechnosoft's concise website assistant. Help with software consulting, training, placement support, and portal access. Never invent pricing or guarantees.",
        }),
      });
      if (response.ok) {
        const result = (await response.json()) as { reply?: string };
        if (result.reply) reply = result.reply;
      }
    }

    await prisma.chatMessage.create({
      data: { conversationId: conversation.id, role: "assistant", content: reply },
    });

    return Response.json({ conversationId: conversation.id, reply });
  } catch (error) {
    console.error("Chat failed", error);
    return Response.json({ error: "The assistant is temporarily unavailable." }, { status: 500 });
  }
}
