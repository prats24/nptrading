import React from 'react'
import './rewardRow.css'

const RewardRow = ({rank, reward}) => {
  return (
    <div className='row-container'>
        <div className='tile'>
            <span>    
                {rank}
            </span>
            <span>
                {reward}
            </span>
        </div>
        <hr></hr>
    </div>
  )
}

export default RewardRow