import ArrowRight16 from '@carbon/icons-react/es/arrow--right/16'
import Maximize16 from '@carbon/icons-react/es/maximize/16'
import Minimize16 from '@carbon/icons-react/es/minimize/16'
import {
  Button,
  Header,
  HeaderGlobalBar,
  HeaderName,
} from 'carbon-components-react'
import React, {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {useLayoutType} from '../../utils/hooks/useLayoutType'
import styles from './action-pad-container.scss'

interface ActionPadProps {
  title: string
  children: React.ReactNode
}

const ActionPadContainer = ({title, children}: ActionPadProps) => {
  const {t} = useTranslation()
  const layout = useLayoutType()

  const [isMaximised, setIsMaximised] = useState(false)

  const toggleWindowState = () => {
    setIsMaximised(!isMaximised)
  }

  return (
    <>
      <Header
        aria-label="Workspace Title"
        className={`${styles.header} ${
          isMaximised ? `${styles.fullWidth}` : `${styles.dynamicWidth}`
        }`}
      >
        <HeaderName prefix="">{title}</HeaderName>
        <HeaderGlobalBar>
          <Button
            iconDescription={
              isMaximised
                ? t('minimize', 'Minimize')
                : t('maximize', 'Maximize')
            }
            hasIconOnly
            kind="ghost"
            onClick={toggleWindowState}
            renderIcon={isMaximised ? Minimize16 : Maximize16}
            tooltipPosition="bottom"
          />
          <Button
            iconDescription={t('hide', 'Hide')}
            hasIconOnly
            kind="ghost"
            onClick={() => {}}
            renderIcon={ArrowRight16}
            tooltipPosition="bottom"
            tooltipAlignment="end"
          />
        </HeaderGlobalBar>
      </Header>
      {children}
    </>
  )
}

export default ActionPadContainer
