import {Button, ToastNotification} from '@bahmni/design-system'
import React, {useEffect, useState} from 'react'
// import {useAsync} from 'react-async'
// import Loader from '../Loader/Loader'
import { getPatientDetails } from '../services/patient'
import { Patient } from '../types/patient'

const styles = {
  container: {
    margin: '1rem 0 0 1rem',
  },
  tileList: {
    margin: 'auto',
    overflow: 'scroll',
    maxHeight: '20rem',
  },
}


const PatientInfo = (props) => {
  const patientName = props.patientName
  // const {data: patientData, error, isPending} = useAsync<Patient>({
  //     promiseFn: getPatientDetails,
  //     patientName: patientName
  // })
  // if (isPending) return <div>Loading...</div>
  // if (error) return <div>Something went wrong: {error.message}</div>
  // if(patientData) {
  //   console.dir(patientData)
  //   return (
  //   <div style={styles.container}>
  //       <div><strong>Patient Name:&nbsp;</strong>{patientData.name}</div>
  //       <div><strong>Health Id:&nbsp;</strong>{patientData.nationalId}</div>
  //       <div><strong>Gender:&nbsp;</strong>{patientData.gender}</div>
  //       <div><strong>Mobile Number:&nbsp;</strong>{patientData.mobileNumber}</div>
  //   </div>
  //   )
  // }
  return <div>inside</div>
}

export default PatientInfo
