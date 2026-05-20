import { useNotify } from '../context/NotificationContext'

const Notification = () => {
  const [notification] = useNotify()

  if (!notification) return null

  const style = {
    border: '2px solid green',
    padding: 10,
    marginBottom: 10
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification