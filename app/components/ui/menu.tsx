import * as React from 'react';
import { Menu } from '@base-ui/react/menu';

export interface MenuOption {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
}

interface AppMenuProps {
  trigger: React.ReactNode;
  options: MenuOption[];
  openOnHover?: boolean;
}

export default function AppMenu({ trigger, options, openOnHover = false }: AppMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        openOnHover={openOnHover}        
      >
        {trigger}
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner className="outline-hidden" alignOffset={0}>
          <Menu.Popup className="relative origin-[var(--transform-origin)] border border-neutral-950 bg-white py-1 text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 outline-hidden transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 dark:border-border dark:bg-neutral-950 dark:text-white dark:shadow-none">
            {options.map((option, index) => (
              <React.Fragment key={index}>
                {option.separator && (
                  <Menu.Separator className="mx-1 my-1 h-px bg-neutral-950 dark:bg-neutral-600" />
                )}
                <Menu.Item
                  className={itemClass}
                  disabled={option.disabled}
                  onClick={option.onClick}
                >
                  {option.label}
                </Menu.Item>
              </React.Fragment>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

const itemClass =
  "flex cursor-default py-2 pr-8 pl-4 text-sm leading-4 outline-hidden select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white data-highlighted:before:absolute data-highlighted:before:inset-x-1 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:bg-neutral-950 data-highlighted:before:content-[''] data-disabled:text-neutral-500 dark:data-highlighted:text-neutral-950 dark:data-highlighted:before:bg-white dark:data-disabled:text-neutral-400";

function CaretDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      style={{ display: 'block', ...props.style }}
    >
      <path d="M12 6H4l4 4.5z" />
    </svg>
  );
}
