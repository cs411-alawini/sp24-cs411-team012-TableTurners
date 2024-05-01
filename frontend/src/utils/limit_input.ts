import { RefObject } from 'react';
import { Tooltip } from 'primereact/tooltip';
import { TooltipEvent } from 'primereact/tooltip/tooltipoptions';

/**
 * limitInput()
 * Handles limiting length of input
 * @param tooltip tooltip to show if limit reached
 * @param setTooltip tooltip message setter
 * @param setValue input value setter
 * @param error_msg error message to show if limit reached
 * @param limit length limit
 * @returns onChange event handler for input
 */
export default function limitInput(
  tooltip: RefObject<Tooltip>,
  setTooltip: (i: any) => void,
  setValue: (i: any) => void,
  error_msg: string,
  limit: number,
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > limit) {
      setTooltip(error_msg);
      tooltip.current?.show(event as unknown as TooltipEvent);
    } else {
      tooltip.current?.hide(event as unknown as TooltipEvent);
    }
    setValue(event.target.value);
  };
}
