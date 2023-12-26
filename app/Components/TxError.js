"client"

const TxError = ({message,dismiss}) => {
  return (
    <div className="message-warning" role="alert">
        <div>Error sending transaction: {message}</div>
        <br />
        <button className="close" onClick={dismiss}>
            <div>Dismiss</div>
        </button>
    </div>
  )
}

export default TxError