import React, { useContext, useReducer, useState } from "react";
import Modal from "../UI/Modal";
import classes from "./Cart.module.css";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";;

const Cart = (props) => {
  const [isCheckout, setISCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const cartCtx = useContext(CartContext);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0; // to show order button only when there are items in the cart

  const cartItemRemoveHandler = (id) => {
      cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem(item);
  };

  const orderHandler = () => {
    setISCheckout(true);
  };

  const submitOrderHanlder = async (userData) => {
    setIsSubmitting(true);
    await fetch('https://react-http-28-default-rtdb.firebaseio.com/orders.json', {
      method: 'POST',
      body: JSON.stringify({
        user: userData,
        orderItems: cartCtx.items
      })
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemoveHandler.bind(null, item.id)/* to make shure id is passes here | pre-configuring func */}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );
        const modalActions = <div className={classes.actions}>
        <button className={classes["button--alt"]} onClick={props.onClose}>
          Close
        </button>
        {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
      </div>

        const cartModalContent =  (<React.Fragment> {cartItems}
      <div className={classes.total}>
        {}
        <span>Total</span>
        <span>{totalAmount}</span>
      </div>
      {isCheckout && <Checkout onConfirm={submitOrderHanlder} onCancle={props.onClose}/>}
      {!isCheckout && modalActions} </React.Fragment>);

          const isSubmittingModalContent = <p>Sending order data...</p>;
          const didSubmitModalContent = <p>successfully sent the order</p>;

  return (
    <Modal onClose={props.onClose}>
     {!isSubmitting && !didSubmit && cartModalContent}
     {isSubmitting && isSubmittingModalContent}
     {!isSubmitting && didSubmit && didSubmitModalContent}
    </Modal>
  );
};

export default Cart;
