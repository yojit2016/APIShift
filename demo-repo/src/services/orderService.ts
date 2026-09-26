import { ApiClient, defaultApiClient, getOrder, createOrder } from "../client/apiClient.js";

export class OrderService {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  public async fetchOrderSummary(id: string): Promise<{ id: string; total: number; status: string }> {
    const res = await this.client.getOrder(id);
    return {
      id: res.id,
      total: res.total,
      status: res.status,
    };
  }

  public async placeOrder(customerId: string, items: Array<{ itemId: string; quantity: number }> = [{ itemId: "item_1", quantity: 1 }]): Promise<any> {
    return await this.client.createOrder({
      customer_id: customerId,
      items,
    });
  }
}

export async function fetchOrderSummary(id: string) {
  const res = await getOrder(id);
  return {
    id: res.id,
    total: res.total,
    status: res.status,
  };
}

export async function placeOrder(customerId: string, items: Array<{ itemId: string; quantity: number }> = [{ itemId: "item_1", quantity: 1 }]) {
  return await createOrder({
    customer_id: customerId,
    items,
  });
}
