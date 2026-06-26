export const company = {
  name: "MRTechnosoft",
  shortName: "MRT",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "support@mrtechnosoft.com",
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE ?? "+1 (720) 339-2386",
  phoneHref: process.env.NEXT_PUBLIC_COMPANY_PHONE_HREF ?? "+17203392386",
  address:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ??
    "9800 Mount Pyramid Court, Suite 400, Englewood, Colorado 80112, USA",
  website:
    process.env.NEXT_PUBLIC_COMPANY_WEBSITE ?? "https://www.mrtechnosoft.com",
  social: [
    {
      name: "WhatsApp",
      handle: "+1 (720) 938-3462",
      href:
        process.env.NEXT_PUBLIC_WHATSAPP_URL ??
        "https://wa.me/17209383462",
    },
    {
      name: "LinkedIn",
      handle: "@mrtechnosoft",
      href:
        process.env.NEXT_PUBLIC_LINKEDIN_URL ??
        "https://www.linkedin.com/company/mrtechnosoft/?viewAsMember=true",
    },
    {
      name: "Instagram",
      handle: "@mrtechnosoft",
      href:
        process.env.NEXT_PUBLIC_INSTAGRAM_URL ??
        "https://www.instagram.com/mrtechnosoft",
    },
    {
      name: "Facebook",
      handle: "@mrtechnosoft",
      href:
        process.env.NEXT_PUBLIC_FACEBOOK_URL ??
        "https://www.facebook.com/MRtechnosoft1/",
    },
    {
      name: "X",
      handle: "@mrtechnosoft",
      href:
        process.env.NEXT_PUBLIC_X_URL ??
        "https://twitter.com/MrTechnosoft",
    },
  ],
} as const;
