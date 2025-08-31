import { tv } from 'tailwind-variants';

export const buttonVariants = tv({
  base: 'ring-offset-background focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',

  variants: {
    variant: {
      default: 'bg-green-900 text-white hover:bg-green-950',
      destructive:
        'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline:
        'border-input bg-background hover:bg-accent hover:text-accent-foreground border',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
      neutral: 'bg-slate-100 text-slate-400 hover:bg-slate-200'
    },
    stretch: {
      true: 'w-full self-stretch',
      false: 'w-fit'
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8'
    }
  },
  compoundVariants: [
    {
      variant: 'link',
      class: 'px-0'
    }
  ],
  defaultVariants: {
    variant: 'default',
    size: 'default',
    stretch: false
  }
});
