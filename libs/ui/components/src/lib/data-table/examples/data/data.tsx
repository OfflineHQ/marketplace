import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons';

export const labels = [
  {
    value: 'bug',
    text: 'Bug',
  },
  {
    value: 'feature',
    text: 'Feature',
  },
  {
    value: 'documentation',
    text: 'Documentation',
  },
];

export const statuses = [
  {
    value: 'backlog',
    text: 'Backlog',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: 'todo',
    text: 'Todo',
    icon: CircleIcon,
  },
  {
    value: 'in progress',
    text: 'In Progress',
    icon: StopwatchIcon,
  },
  {
    value: 'done',
    text: 'Done',
    icon: CheckCircledIcon,
  },
  {
    value: 'canceled',
    text: 'Canceled',
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    text: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    text: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    text: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
];
