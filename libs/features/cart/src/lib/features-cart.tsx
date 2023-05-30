import styles from './features-cart.module.css';

/* eslint-disable-next-line */
export interface FeaturesCartProps {}

export function FeaturesCart(props: FeaturesCartProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeaturesCart!</h1>
    </div>
  );
}

export default FeaturesCart;
