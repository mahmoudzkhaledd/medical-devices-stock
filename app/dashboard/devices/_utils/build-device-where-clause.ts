export interface DeviceFilterParams {
  serialNumber?: string;
  manufacturerId?: string;
  modelId?: string;
  typeId?: string;
  departmentId?: string;
  supplierId?: string;
}

export function buildDeviceWhereClause(params: DeviceFilterParams) {
  const where: any = {};

  // 1. Serial Number partial match (safe trim and case-insensitive)
  if (params.serialNumber && params.serialNumber.trim() !== "") {
    where.serialNumber = {
      contains: params.serialNumber.trim(),
      mode: "insensitive" as const,
    };
  }

  // 2. Direct Model ID filter
  if (params.modelId && params.modelId !== "all") {
    where.modelId = params.modelId;
  }
  if (params.supplierId && params.supplierId !== "all") {
    where.supplierId = params.supplierId;
  }

  // 3. Direct Department ID filter
  if (params.departmentId && params.departmentId !== "all") {
    where.departmentId = params.departmentId;
  }

  // 4. Manufacturer ID through DeviceModel relation
  if (params.manufacturerId && params.manufacturerId !== "all") {
    where.model = {
      ...where.model,
      manufacturerId: params.manufacturerId,
    };
  }

  // 5. Device Type ID through DeviceModel relation
  if (params.typeId && params.typeId !== "all") {
    where.model = {
      ...where.model,
      typeId: params.typeId,
    };
  }

  return where;
}
