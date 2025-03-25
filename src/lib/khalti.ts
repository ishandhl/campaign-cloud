
export interface KhaltiConfig {
  publicKey: string;
  productIdentity: string;
  productName: string;
  productUrl: string;
  amount: number;
  returnUrl?: string;
}

// This function would be used to initialize Khalti payment
export const initKhaltiPayment = (config: KhaltiConfig, onSuccess: (data: any) => void, onError: (error: any) => void) => {
  // In a real application, this would use the Khalti SDK
  // For now, we'll simulate a payment flow with a timeout
  
  console.log("Initializing Khalti payment with config:", config);
  
  // Simulate payment process
  setTimeout(() => {
    // Generate a random success/failure outcome (90% success rate for demo)
    const isSuccess = Math.random() < 0.9;
    
    if (isSuccess) {
      const mockResponse = {
        idx: `mock_payment_${Date.now()}`,
        token: `mock_token_${Math.random().toString(36).substring(2, 15)}`,
        amount: config.amount,
        mobile: "98XXXXXXXX",
        product_identity: config.productIdentity,
        product_name: config.productName,
        created_on: new Date().toISOString()
      };
      
      onSuccess(mockResponse);
    } else {
      onError({
        error: true,
        message: "Payment failed or cancelled by user"
      });
    }
  }, 2000);
};

// Function to verify Khalti payment (would be called from server-side in a real app)
export const verifyKhaltiPayment = async (token: string, amount: number) => {
  // In a real app, this would be a server-side call to Khalti's verification API
  // For demo purposes, we'll simulate a successful verification
  
  console.log("Verifying Khalti payment:", { token, amount });
  
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          idx: `mock_verification_${Date.now()}`,
          token,
          amount,
          status: "Completed",
          created_on: new Date().toISOString()
        }
      });
    }, 1000);
  });
};
