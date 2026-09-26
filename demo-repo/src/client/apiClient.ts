export interface OrderResponse {
  id: string;
  totalAmount?: number;
  total?: number;
  status: string;
}

export interface CreateOrderPayload {
  customer_id?: string;
  customer?: { id: string };
  items: Array<{ itemId: string; quantity: number }>;
  coupon_code?: string;
}

export class ApiClient {
  private schemaMode: "before" | "after";

  constructor(schemaMode: "before" | "after" = "after") {
    this.schemaMode = schemaMode;
  }

  public async getOrder(id: string): Promise<any> {
    if (this.schemaMode === "before") {
      return {
        id: id || "ord_101",
        total: 150.0,
        status: "completed",
      };
    }
    // after.yaml schema: total is renamed to totalAmount
    return {
      id: id || "ord_101",
      totalAmount: 150.0,
      status: "completed",
    };
  }

  public async createOrder(payload: CreateOrderPayload): Promise<any> {
    if (this.schemaMode === "after") {
      if (!payload.customer || !payload.customer.id) {
        throw new Error("ValidationError: Missing required nested field customer.id");
      }
      return {
        id: "ord_new_1",
        totalAmount: 200.0,
        status: "created",
      };
    }
    if (!payload.customer_id) {
      throw new Error("ValidationError: Missing required field customer_id");
    }
    return {
      id: "ord_new_1",
      total: 200.0,
      status: "created",
    };
  }
}

export const defaultApiClient = new ApiClient("after");

export async function getOrder(id: string): Promise<any> {
  return defaultApiClient.getOrder(id);
}

export async function createOrder(payload: CreateOrderPayload): Promise<any> {
  return defaultApiClient.createOrder(payload);
}
