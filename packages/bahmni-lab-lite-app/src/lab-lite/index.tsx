import React from 'react'
import {useTranslation} from 'react-i18next'
import { useConfig} from '@openmrs/esm-framework';

const LabLite: React.FC = () => {
  const {t} = useTranslation()
  return <h1>Hello {t('title')}</h1>
}

export default LabLite
