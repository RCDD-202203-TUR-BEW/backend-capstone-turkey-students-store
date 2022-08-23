import './App.css';
import StripeCheckout from 'react-stripe-checkout';
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

function App() {
  const publishableKey =
    'pk_test_51LYVzxGPwek4o8KsyDHSmU4OkLDOVJ27cj2fjctejMOfglJgvttUk5FHVWe8Zt4M3b8MqM4KYb6HSCmzU9wgIdax00VeXKGr7X';
  const [product, setProduct] = useState({
    name: 'Amount',
    price: 50,
  });
  const priceForStripe = product.price * 100;

  const handleSuccess = () => {
    MySwal.fire({
      icon: 'success',
      title: 'Payment was successful',
      time: 4000,
    });
  };
  const handleFailure = () => {
    MySwal.fire({
      icon: 'error',
      title: 'Payment was not successful',
      time: 4000,
    });
  };
  const payNow = async (token) => {
    try {
      const response = await axios({
        url: 'http://localhost:3000/api/donations',
        method: 'post',
        data: {
          amount: product.price * 100,
          token,
        },
      });
      console.log('RESPONSE:', response);
      console.log(response.body.success === false);

      if (response.status === 200) {
        handleSuccess();
      }
    } catch (error) {
      handleFailure();
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h2>Complete React & Stripe payment integration</h2>
      <p>
        <span>Product: </span>
        {product.name}
      </p>
      <p>
        <span>Price: </span>${product.price}
      </p>
      <StripeCheckout
        stripeKey={publishableKey}
        label="Pay Now"
        name="Pay With Credit Card"
        billingAddress
        shippingAddress
        amount={priceForStripe}
        description={`Your total is $${product.price}`}
        token={payNow}
      />
    </div>
  );
}

export default App;
