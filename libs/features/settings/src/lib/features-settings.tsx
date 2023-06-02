import styles from './features-settings.module.css';

/* eslint-disable-next-line */
export interface FeaturesSettingsProps {}

export function FeaturesSettings(props: FeaturesSettingsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FeaturesSettings!</h1>
    </div>
  );
}

export default FeaturesSettings;
