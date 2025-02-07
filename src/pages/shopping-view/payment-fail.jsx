import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl">
          Payment failed! Please try again.{" "}
        </CardTitle>
      </CardHeader>
      <Button className="mt-5" onClick={() => navigate("/shop/home")}>
        Return to home
      </Button>
    </Card>
  );
}

export default PaymentFailed;
