import React from 'react'
import RewardRow from './RewardRow';
import './rewardsTable.css';

const RewardsTable = () => {
  const rewards = [
    {
      rank: '1',
      reward: '200'
    },
    {
      rank: '2',
      reward: '150'
    },
    {
      rank:'3',
      reward: '100'
    },
    {
      rank: '4-10',
      reward: '30'
    },
    {
      rank:'11-20',
      reward: '10'
    }
]

  return (
    <div>
        <div className='container'>
            <div className='header'>
                <span>Rank</span>
                <span>Reward</span>
            </div>
            <div className='rewardRows'>
            {
              rewards.map((reward)=>{
                return <RewardRow rank={reward.rank} reward={reward.reward}/> 
              })
            }
            </div>
        </div>
    </div>
  )
}

export default RewardsTable