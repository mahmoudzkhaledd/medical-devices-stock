import prisma from "@/prisma";
import AddDeviceModelForm from "./_components/add-device-model-form";

export const dynamic = "force-dynamic";

export default async function NewDeviceModelPage({
  searchParams,
}: {
  searchParams: Promise<{
    modelId?: string;
  }>;
}) {
  const { modelId } = await searchParams;

  const [model] = await Promise.all([
    ...(modelId && modelId.length > 0
      ? [
          prisma.deviceModel.findUnique({
            where: { id: `${modelId}` },
            include: {
              manufacturer: true,
              type: true,
            },
          }),
        ]
      : []),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="text-muted-foreground text-sm">
          {model
            ? "Dashboard / Device Models / Edit"
            : "Dashboard / Device Models / Add New"}
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {model ? "Edit Device Model" : "Add Device Model"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {model
            ? "Modify the technical identifiers and classification for this equipment model."
            : "Register a new medical equipment model, assign its manufacturer, device type, and tracking mode."}
        </p>
      </div>

      {/* Interactive Form Component */}
      <AddDeviceModelForm deviceModel={model ?? undefined} />
    </div>
  );
}
