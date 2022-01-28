import {useCookies} from 'react-cookie'

export const useUserLocationUuid = () => {
  const [cookie] = useCookies()
  return cookie['bahmni.user.location'].uuid
}

export const useProviderName = () => {
  const [cookie] = useCookies()
  return cookie['bahmni.user']
}
