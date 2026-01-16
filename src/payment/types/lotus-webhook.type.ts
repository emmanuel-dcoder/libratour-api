export interface LotusCardPaymentWebhook {
  service: 'payments';
  type: 'card';
  data: {
    status: 'successful' | 'failed';
    reference: string;
    client_reference?: string;
    client_metadata?: any;
    amount: number;
    card: {
      bin: string;
      last4: string;
      scheme: string;
      cardholder?: string;
    };
  };
}
