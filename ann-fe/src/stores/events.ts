export class EVENTS {

  public static USER_LOGGED_IN = 'SET:USER';
  public static USER_REHYDRATE = 'HYDRATE:USER';
  public static USER_LOGGED_OUT = 'CLEAR:USER';

  public static USER_UPDATED = 'DATA:USER:UPDATE';
  
  public static ADD_ITEM_TO_CART = 'ADD:CART';
  public static REMOVE_ITEM_FROM_CART = 'REMOVE:CART';
  public static CLEAR_CART = 'CLEAR:CART';

  public static CACHE = {
    USER: 'ann-user',
    CART: 'ann-items',
    LOCALE: 'ann-locale'
  };
}