import React from 'react'

const ConnectToWallet = ({connect}) => {
  return (
    <div className='container'>
      <div>
        please connect to wallet.
      </div>
      <div className='action-button' onClick={connect}>
        Connect to Wallet
      </div>
    </div>
  )
}

export default ConnectToWallet