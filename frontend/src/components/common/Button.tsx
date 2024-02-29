import { CommandBarButton, DefaultButton, IButtonProps } from "@fluentui/react";

import styles from './Button.module.css';

interface ButtonProps extends IButtonProps {
  onClick: () => void;
  text: string | undefined;
}

export const ShareButton: React.FC<ButtonProps> = ({ onClick, text }) => {

  return (
    <CommandBarButton
      className={styles.shareButtonRoot}
      iconProps={{ iconName: 'Share' }}
      onClick={onClick}
      text={text}
    />
  )
}

export const HistoryButton: React.FC<ButtonProps> = ({ onClick, text }) => {
  return (
    <DefaultButton
      className={styles.historyButtonRoot}
      text={text}
      iconProps={{ iconName: 'History' }}
      onClick={onClick}
    />
  )
}

interface LoginButtonProps extends IButtonProps {
  onClick: () => void;
}

export const LoginButton: React.FC<ShareButtonProps> = ({onClick}) => {
  const shareButtonStyles: ICommandBarStyles & IButtonStyles = {
      root: {
        width: 100,
        height: 32,
        borderRadius: 4,
        background: 'radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)',
      //   position: 'absolute',
      //   right: 20,
        padding: '5px 12px',
        marginRight: '20px'
      },
      icon: {
        color: '#FFFFFF',
      },
      rootHovered: {
        background: 'linear-gradient(135deg, #0F6CBD 0%, #2D87C3 51.04%, #8DDDD8 100%)',
      },
      label: {
        fontWeight: 600,
        fontSize: 14,
        lineHeight: '20px',
        color: '#FFFFFF',
      },
    };

    return (
      <CommandBarButton
              styles={shareButtonStyles}
              iconProps={{ iconName: 'Contact' }}
              onClick={onClick}
              text="Log In"
      />
    )
}