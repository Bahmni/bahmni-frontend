import {useCookies} from 'react-cookie'

export const useUserLocationUuid = () => {
  const [cookie] = useCookies()
  return {locationUuid: cookie['bahmni.user.location'].uuid}
}

export const useProviderName = () => {
  const [cookie] = useCookies()
  return {providerName: cookie['bahmni.user']}
}
