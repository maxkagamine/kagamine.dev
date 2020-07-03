import { Button, Tooltip } from '@material-ui/core';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import React from 'react';
import { useIntl } from 'react-intl';
import { NotificationsState, useFirebaseNotifications } from '../../utils/useFirebaseNotifications';

export function NotificationsButton(props: {}) {
  const intl = useIntl();
  const [state, subscribe] = useFirebaseNotifications(intl.locale);

  if (state == NotificationsState.NotSupported) {
    return null;
  }

  return (
    <Tooltip title={intl.formatMessage({ id: 'notificationsTooltip' })}>
      <span>
        <Button
          startIcon={state == NotificationsState.Subscribed ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
          onClick={() => subscribe(state != NotificationsState.Subscribed)}
        >
          {intl.formatMessage({ id: 'notificationsButton' })}
        </Button>
      </span>
    </Tooltip>
  );
}
