import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => ({ toggleVisibility }))

  return (
    <div>
      {!visible && (
        <button className="togglable-btn" onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      )}
      {visible && (
        <div className="togglable-panel">
          {props.children}
          <button
            className="togglable-btn"
            style={{ marginTop: 12, marginBottom: 0 }}
            onClick={toggleVisibility}
          >
            cancel
          </button>
        </div>
      )}
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable