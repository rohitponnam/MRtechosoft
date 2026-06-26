type LeadInput = {
  email: string;
  phone?: string | null;
  company?: string | null;
  interest: string;
  message?: string | null;
  budget?: string | null;
  timeline?: string | null;
  source?: string | null;
};

export function scoreLead(input: LeadInput) {
  let score = 10;
  const reasons: string[] = ["complete contact request"];

  if (input.phone) {
    score += 8;
    reasons.push("phone provided");
  }
  if (input.company) {
    score += 12;
    reasons.push("company identified");
  }
  if (input.message && input.message.length >= 60) {
    score += 12;
    reasons.push("detailed project context");
  }
  if (input.budget && !/not sure|under/i.test(input.budget)) {
    score += 20;
    reasons.push("qualified budget");
  }
  if (input.timeline && /immediate|30|1-3|quarter/i.test(input.timeline)) {
    score += 18;
    reasons.push("near-term timeline");
  }
  if (/software|ai|consulting/i.test(input.interest)) {
    score += 10;
    reasons.push("high-value service interest");
  }
  if (!/@(gmail|yahoo|outlook|hotmail)\./i.test(input.email)) {
    score += 10;
    reasons.push("business email");
  }
  if (/referral|partner/i.test(input.source ?? "")) {
    score += 10;
    reasons.push("trusted source");
  }

  return {
    score: Math.min(score, 100),
    reason: reasons.join(", "),
  };
}
