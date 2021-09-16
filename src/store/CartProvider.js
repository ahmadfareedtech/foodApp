import { useReducer } from "react";
import CartContext from "./cart-context";

const defaultCartState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  if (action.type === "ADD") {
    const updatedTotalAmount =
      state.totalAmount + action.item.price * action.item.amount;

    const existingCartItemsIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );

    const existingCartItem = state.items[existingCartItemsIndex];

    let updatedItems;

    if (existingCartItem) {
      //if item is part of array
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount,
      };
      updatedItems = [...state.items]; //updating immutably by creating new array
      updatedItems[existingCartItemsIndex] = updatedItem;

    } else {
      // if for the first time item is being added
      updatedItems = state.items.concat(action.item);
    }

    return {
      //returning new state snapshot
      items: updatedItems,
      totalAmount: updatedTotalAmount,
    };
  }
  if(action.type === 'REMOVE') {
    const existingCartItemsIndex = state.items.findIndex(
        (item) => item.id === action.id
      );
      const existingItem = state.items[existingCartItemsIndex];
      const updatedTotalAmount = state.totalAmount - existingItem.price;

      let updatedItems;
      if(existingItem.amount === 1) {
            updatedItems = state.items.filter((item) => item.id !== action.id); // filters array | if false then that item is not included in new array
      } else {
        const updatedItem = {...existingItem, amount: existingItem.amount -1};
        updatedItems = [...state.items];
        updatedItems[existingCartItemsIndex] = updatedItem;
      }

      return {
          items: updatedItems,
          totalAmount: updatedTotalAmount
      };
  }

  return defaultCartState;
};

// now with the help of this we can wrap any component that reqire this context
const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: "ADD", item: item });
  };

  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: "REMOVE", id: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
