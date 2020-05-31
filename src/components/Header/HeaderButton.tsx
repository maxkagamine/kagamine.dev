import { IconButton, IconButtonProps, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { GatsbyLinkProps, Link } from 'gatsby';
import React from 'react';

type HeaderButtonProps = (IconButtonProps<'a'> | IconButtonProps<'a', GatsbyLinkProps<{}>>) & {
  title: string
};

const useStyles = makeStyles({
  disabled: {
    opacity: 0.5
  }
});

export function HeaderButton(props: HeaderButtonProps) {
  const { title, className, ...rest } = props;
  const classes = useStyles(props);
  const component: React.ElementType = 'to' in props ? Link : 'a';

  return (
    <Tooltip title={title}>
      <span className={clsx(className, { [classes.disabled]: props.disabled })}>
        <IconButton {...rest} component={component} aria-label={title} />
      </span>
    </Tooltip>
  );
}
