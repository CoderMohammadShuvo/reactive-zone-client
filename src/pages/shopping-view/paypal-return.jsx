import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const paymentId = params.get("paymentId");
  // const payerId = params.get("PayerID");
  const paymentId = "123456tr";
  const payerId = "334568uyt";

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          console.log(window.location.href);
          window.location.href = "/shop/payment-success";
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;

// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { capturePayment } from "@/store/shop/order-slice";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";

// function PaypalReturnPage() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const paymentId = params.get("paymentId");
//   // const navigatTo = useNavigate();

//   useEffect(() => {
//     if (paymentId) {
//       const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

//       dispatch(capturePayment({ paymentId, orderId })).then((data) => {
//         console.log(data);
//         if (data?.payload?.success) {
//           sessionStorage.removeItem("currentOrderId");
//           console.log(window.location.href);
//           window.location.href = "/shop/payment-success";
//           // navigatTo("/shop/payment-success");
//         }
//       });
//     }
//   }, [paymentId, dispatch]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Processing Payment...Please wait!</CardTitle>
//       </CardHeader>
//     </Card>
//   );
// }

// export default PaypalReturnPage;
