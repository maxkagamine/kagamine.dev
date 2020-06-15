import { Unit } from '@formatjs/intl-relativetimeformat';
import { useIntl } from 'react-intl';

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = MS_IN_SECOND * 60;
const MS_IN_HOUR = MS_IN_MINUTE * 60;
const MS_IN_DAY = MS_IN_HOUR * 24;
const MS_IN_MONTH = MS_IN_DAY * (365 / 12);
const MS_IN_YEAR = MS_IN_DAY * 365;

// Same thresholds as https://momentjs.com/docs/#/displaying/fromnow/
function getValueAndUnit(date: string): [number, Unit] {
  let ms = new Date(date).getTime() - new Date().getTime();

  let seconds = Math.round(ms / MS_IN_SECOND);
  if (Math.abs(seconds) < 45) {
    return [seconds, 'second'];
  }

  let minutes = Math.round(ms / MS_IN_MINUTE);
  if (Math.abs(minutes) < 45) {
    return [minutes, 'minute'];
  }

  let hours = Math.round(ms / MS_IN_HOUR);
  if (Math.abs(hours) < 22) {
    return [hours, 'hour'];
  }

  let days = Math.round(ms / MS_IN_DAY);
  if (Math.abs(days) < 26) {
    return [days, 'day'];
  }

  if (Math.abs(days) < 320) {
    let months = Math.round(ms / MS_IN_MONTH);
    return [months, 'month'];
  }

  let years = Math.round(ms / MS_IN_YEAR);
  return [years, 'year'];
}

/**
 * Returns a function that uses `intl.formatRelativeTime()` with automatic units
 * similar to moment's `fromNow()`.
 */
export function useTimeAgo() {
  const intl = useIntl();
  return (date: string) => {
    let [value, unit] = getValueAndUnit(date);
    return intl.formatRelativeTime(value, unit, { numeric: 'auto' });
  };
}
