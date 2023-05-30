import styles from './features-pass.module.css';

/* eslint-disable-next-line */
export interface FeaturesPassProps {}

export function FeaturesPass(props: FeaturesPassProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeaturesPass!</h1>
    </div>
  );
}

export default FeaturesPass;
