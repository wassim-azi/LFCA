import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from './button-variants';

import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // When rendering a native <button> element, default its type to "button"
    // to avoid accidental form submissions and to reduce false positives from
    // password managers or form-capture browser extensions. If `asChild` is
    // used we must not inject a `type` prop because the child element might
    // not accept it.
    const finalProps = asChild
      ? props
      : ({
          type: (props as React.ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button',
          ...props,
        } as React.ButtonHTMLAttributes<HTMLButtonElement>);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...finalProps}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
