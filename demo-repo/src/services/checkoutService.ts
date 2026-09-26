import { ApiClient, defaultApiClient, getOrder } from "../client/apiClient.js";

export class CheckoutService {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  public async calculateOrderTax(id: string): Promise<number> {
    const res = await this.client.getOrder(id);
    if (typeof res.total !== "number") {
      throw new Error(`AssertionError: expected ${typeof res.total} to be a number`);
    }
    return res.total * 0.08;
  }

  public async validateOrderMinimum(id: string): Promise<boolean> {
    const res = await this.client.getOrder(id);
    if (res.total === undefined) {
      throw new TypeError("Cannot read property 'total' of undefined");
    }
    return res.total >= 50;
  }
}

export async function calculateOrderTax(id: string): Promise<number> {
  const res = await getOrder(id);
  if (typeof res.total !== "number") {
    throw new Error(`AssertionError: expected ${typeof res.total} to be a number`);
  }
  return res.total * 0.08;
}

export async function validateOrderMinimum(id: string): Promise<boolean> {
  const res = await getOrder(id);
  if (res.total === undefined) {
    throw new TypeError("Cannot read property 'total' of undefined");
  }
  return res.total >= 50;
}
