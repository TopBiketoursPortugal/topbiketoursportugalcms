import Icons from '../../data/icons.json';

export type IconNames = (typeof Icons)[number];

export type VisuallyEditable = {
  'bookshop:live': boolean | undefined;
};
