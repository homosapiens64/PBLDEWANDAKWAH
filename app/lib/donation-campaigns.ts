import type { DonationCampaign } from "@prisma/client";
import { prisma } from "./prisma";

export async function ensureDonationCampaignsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS \`donation_campaigns\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`title\` VARCHAR(180) NOT NULL,
      \`summary\` TEXT NULL,
      \`badge\` VARCHAR(40) NOT NULL DEFAULT 'OPEN DONASI',
      \`org\` VARCHAR(120) NOT NULL DEFAULT 'LAZNAS Dewan Dakwah Jawa Tengah',
      \`image_url\` LONGTEXT NULL,
      \`href\` VARCHAR(500) NOT NULL,
      \`remaining_time\` VARCHAR(80) NOT NULL,
      \`collected_amount\` INT NOT NULL DEFAULT 0,
      \`target_amount\` INT NULL,
      \`progress\` INT NOT NULL DEFAULT 0,
      \`status\` VARCHAR(20) NOT NULL DEFAULT 'published',
      \`sort_order\` INT NOT NULL DEFAULT 0,
      \`author_role\` VARCHAR(20) NOT NULL,
      \`author_name\` VARCHAR(100) NOT NULL,
      \`created_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      \`updated_at\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (\`id\`),
      INDEX \`donation_campaigns_status_sort_order_idx\` (\`status\`, \`sort_order\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

export async function getDonationCampaigns(): Promise<DonationCampaign[]> {
  await ensureDonationCampaignsTable();

  return prisma.donationCampaign.findMany({
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }, { id: "desc" }],
  });
}

export async function getPublishedDonationCampaigns(take = 6): Promise<DonationCampaign[]> {
  await ensureDonationCampaignsTable();

  return prisma.donationCampaign.findMany({
    where: { status: "published" },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }, { id: "desc" }],
    take,
  });
}
