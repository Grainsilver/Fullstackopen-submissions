import { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload

    case 'HIDE':
      return ''

    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(
    notificationReducer,
    ''
  )

  const notify = (message) => {
    dispatch({
      type: 'SHOW',
      payload: message
    })

    setTimeout(() => {
      dispatch({ type: 'HIDE' })
    }, 5000)
  }

  return (
    <NotificationContext.Provider
      value={[notification, notify]}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  return useContext(NotificationContext)
}