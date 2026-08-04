import { prisma } from "./prisma";
import type {
  CreateWidgetInput,
  UpdateWidgetInput,
} from "@/lib/validation/schemas";
import type { Widget } from "@prisma/client";

export async function createWidget(
  tenantId: string,
  input: CreateWidgetInput,
): Promise<Widget> {
  return prisma.widget.create({
    data: {
      tenantId,
      type: input.type,
      title: input.title,
      description: input.description ?? null,
      buttonText: input.buttonText,
      fields: input.fields,
      displayOptions: input.displayOptions ?? undefined,
    },
  });
}

export async function listWidgetsForTenant(
  tenantId: string,
): Promise<Widget[]> {
  return prisma.widget.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWidgetForTenant(
  id: string,
  tenantId: string,
): Promise<Widget | null> {
  return prisma.widget.findFirst({ where: { id, tenantId } });
}

export async function getWidgetById(id: string): Promise<Widget | null> {
  return prisma.widget.findUnique({ where: { id } });
}

export async function updateWidgetForTenant(
  id: string,
  tenantId: string,
  input: UpdateWidgetInput,
): Promise<Widget | null> {
  const existing = await getWidgetForTenant(id, tenantId);
  if (!existing) return null;

  return prisma.widget.update({
    where: { id },
    data: {
      ...(input.type !== undefined && { type: input.type }),
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
      ...(input.buttonText !== undefined && { buttonText: input.buttonText }),
      ...(input.fields !== undefined && { fields: input.fields }),
      ...(input.displayOptions !== undefined && {
        displayOptions: input.displayOptions,
      }),
      ...(input.isActive !== undefined && { isActive: input.isActive }),

      bundleVersion: { increment: 1 },
    },
  });
}

export async function deleteWidgetForTenant(
  id: string,
  tenantId: string,
): Promise<boolean> {
  const existing = await getWidgetForTenant(id, tenantId);
  if (!existing) return false;

  await prisma.widget.delete({ where: { id } });
  return true;
}
