import { useContext, useState, useCallback, useMemo } from 'react'
import { AuthUserContext, AuthStateContext, AuthActionsContext } from './Auth'

export function useAuthState() {
  const authState = useContext(AuthStateContext)
  return authState
}

export function useAuthActions() {
  const actions = useContext(AuthActionsContext)
  return actions
}

export function useAuthUser() {
  const user = useContext(AuthUserContext)
  return user
}

export function useLogin(credentialsConf = ['username', 'password']) {
  const [credentials, setCredentials] = useState({})
  const { loginError, loginLoading } = useAuthState()
  const { login } = useAuthActions()

  const loginWithCredentials = useCallback(() => {
    login(credentials)
  }, [login, credentials])

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      loginWithCredentials()
    },
    [loginWithCredentials]
  )

  const valuesProps = useMemo(() => {
    return credentialsConf.reduce(
      (out, name) => ({
        ...out,
        [name]: {
          value: credentials[name] === undefined ? '' : credentials[name],
        },
      }),
      {}
    )
  }, [credentials, credentialsConf])

  const onChangesProps = useMemo(() => {
    return credentialsConf.reduce(
      (out, name) => ({
        ...out,
        [name]: {
          // TODO: check for no event simply string....
          onChange: e => {
            const value = e.target.value
            setCredentials(credentials => ({
              ...credentials,
              [name]: value,
            }))
          },
        },
      }),
      {}
    )
  }, [setCredentials, credentialsConf])

  const credentialsProps = useMemo(() => {
    return Object.keys(valuesProps).reduce(
      (r, name) => ({
        ...r,
        [name]: {
          ...valuesProps[name],
          ...onChangesProps[name],
        },
      }),
      {}
    )
  }, [valuesProps, onChangesProps])

  // console.log({
  //   valuesProps,
  //   onChangesProps,
  //   credentialsProps
  // })

  return {
    handleSubmit,
    login: loginWithCredentials,
    loginError,
    loginLoading,
    ...credentialsProps,
  }
}
