const Notification = ({ message }) => {
  if (!message) return null

  return (
    <div className={`notification ${message.type}`}>
      {message.text}
    </div>
  )
}

export default Notification