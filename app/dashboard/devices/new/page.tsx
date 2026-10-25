import prisma from "@/prisma";
import CreateDeviceForm from "./_components/create-device-form";

export default async function CreateDevicePage({
  searchParams,
}: {
  searchParams: Promise<{
    modelId?: string;
  }>;
}) {
  const { modelId } = await searchParams;
  const deviceModel = modelId
    ? await prisma.deviceModel.findUnique({
        where: { id: `${modelId}` },
        include: {
          manufacturer: true,
          type: true,
        },
      })
    : undefined;
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">
          Dashboard / Devices / New Device
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Register New Devices
        </h1>
        <p className="text-muted-foreground text-sm">
          Add medical equipment to your inventory, assign it to a department,
          and register individual serial numbers and accessories.
        </p>
      </div>

      <CreateDeviceForm deviceModel={deviceModel ?? undefined} />
    </div>
  );
}
