import { Ping, type PingProps } from './Ping';
import { Button } from '../button/Button';
import { ButtonWithOnlyIcon } from '../button/Button.stories';

export function PingButtonDemo(props: PingProps) {
  return (
    <Ping {...props}>
      <Button {...ButtonWithOnlyIcon.args} />
    </Ping>
  );
}
