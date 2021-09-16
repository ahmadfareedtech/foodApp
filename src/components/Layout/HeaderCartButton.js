import { Fragment } from "react/cjs/react.production.min"
import CartIcon from "../Cart/CartIcon";
import classes from './HeaderCartButton.module.css'
import CartContext from "../../store/cart-context";
import { useContext, useEffect, useState } from "react";


const HeaderCartButton = props => {

    const [btnIsHighlighted, setBtnIsHighlighted] = useState(false);

    const cartCtx = useContext(CartContext);
    
    const {items} = cartCtx;

    const numberOfCartItems = items.reduce((curNumber, item)=> {
        return curNumber + item.amount;
    }, 0); 

    const btnClasses = `${classes.button} ${btnIsHighlighted ? classes.bump : ''}`; //template literal notaion with back ticks

    useEffect(() => {
        if(cartCtx.items.length === 0) {
            return;
        }
        setBtnIsHighlighted(true);

        const timer = setTimeout(() => {
            setBtnIsHighlighted(false)
        }, 300);

        //cleaner funtion for timer etc
        // if we return a function in use effect it is automatically called by react
        return () => {
            clearTimeout(timer);
        };

    }, [items]);

    return <Fragment>
        <button className={btnClasses} onClick={props.onClick}>
            <span className={classes.icon}>
                <CartIcon />
            </span>
            <span>Your Cart</span>
            <span className={classes.badge}>
                {numberOfCartItems}
            </span>
        </button>
    </Fragment>
};

export default HeaderCartButton;