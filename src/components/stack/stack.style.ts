import type { HTMLAttributes } from "astro/types";
import { tv, type VariantProps } from "tailwind-variants";

// Define the stack variants using tailwind-variants
export const stack = tv({
  base: "flex",
  variants: {
    reverse: { true: "", false: "" },
    layout: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    spacing: {
      none: "gap-0",
      small: "gap-2",
      medium: "gap-4",
      large: "gap-6",
      xlarge: "gap-8",
    },
    alignment: {
      leading: "items-start",
      center: "items-center",
      trailing: "items-end",
      fill: "items-stretch",
    },
    distribution: {
      leading: "justify-start",
      center: "justify-center",
      trailing: "justify-end",
      spaceBetween: "justify-between",
      spaceAround: "justify-around",
      spaceEvenly: "justify-evenly",
    },
  },
  compoundVariants: [
    {
      reverse: true,
      layout: "vertical",
      class: "flex-col-reverse",
    },
    {
      reverse: true,
      layout: "horizontal",
      class: "flex-row-reverse",
    },
  ],

  defaultVariants: {
    reverse: false,
    layout: "vertical",
    spacing: "medium",
    alignment: "fill",
    distribution: "leading",
  },
});

type components = "div" | "section" | "aside" | "ul";

export type StackProps = VariantProps<typeof stack> & {
  as?: components;
} & Pick<HTMLAttributes<components>, "class">;
