
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { initKhaltiPayment, KhaltiConfig } from "@/lib/khalti";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface KhaltiPaymentButtonProps {
  amount: number;
  productName: string;
  productIdentity: string;
  onSuccess: (data: any) => void;
  onError: (error: any) => void;
  disabled?: boolean;
  className?: string;
}

const KhaltiPaymentButton: React.FC<KhaltiPaymentButtonProps> = ({
  amount,
  productName,
  productIdentity,
  onSuccess,
  onError,
  disabled = false,
  className
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Khalti requires amount in paisa (1 NPR = 100 paisa)
    // For simplicity, we'll treat our amount as cents (1 USD = 100 cents)
    const amountInPaisa = amount * 100;
    
    const config: KhaltiConfig = {
      publicKey: "test_public_key_43652716fd734ba3a7cc4db1ae5", // Replace with your actual Khalti public key
      productIdentity,
      productName,
      productUrl: window.location.href,
      amount: amountInPaisa,
    };
    
    initKhaltiPayment(
      config,
      (paymentData) => {
        setIsProcessing(false);
        onSuccess(paymentData);
      },
      (error) => {
        setIsProcessing(false);
        onError(error);
      }
    );
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      className={className}
    >
      {isProcessing ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          Processing...
        </>
      ) : (
        "Pay with Khalti"
      )}
    </Button>
  );
};

export default KhaltiPaymentButton;
