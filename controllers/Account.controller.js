import Account from '../models/Account'
import _ from 'lodash'

export async function getAccounts(req, res) {
  let accounts = null
  let count = await Account.count().catch(err => { console.log('getAccounts: ', err.message)})
  accounts = await Account.find()
  if (!accounts) {
    return res.json(500).end()
  }

  res.json({ list: accounts, count })
}


export async function deleteAccount(req, res) {
  let result = await Account.deleteOne({_id: req.body.account_id}).catch(err => { console.log('deleteAccount: ', err.message)})
  if (!result) {
    return res.status(500).end()
  }

  res.json({ error: false })
}

export async function updateAccount(req, res) {
  let Account = await Account.findOne({_id: req.body._id}).catch(err => { console.log('Update Account: ', err.message)})

  if (!Account) {
    return res.status(500).end()
  }

  Account.name = req.body.name
  Account.player_num = req.body.player_num
  Account.total_point = req.body.total_point
  Account.cur_point = req.body.cur_point
  Account.unlocked_skin = req.body.unlocked_skin
  Account.country = req.body.country
  Account.os = req.body.os
  Account.mobile_type = req.body.mobile_type
  Account.referral = req.body.referral
  Account.account_type = req.body.account_type
  Account.team = req.body.team
  Account.team_join_date = req.body.team_join_date
  Account.team_exit_date = req.body.team_exit_date

  await Account.save().catch(err => { console.log('updateUser: ', err.message)})

  res.json({ error: false })
}

export async function createAccount(req, res) {
  newAccountObj = _.pick(req.body, [
    'user_name', 
    'player_num', 
    'total_point', 
    'cur_point', 
    'unlocked_skin',
    'country',
    'os',
    'mobile_type',
    'referral',
    'account_type',
    'team',
    'team_join_date',
    'team_exit_date'
  ])

  if (!newAccountObj.user_name) {
    return res.status(400).json({ msg: 'Please enter all fields' })
  }

  try {
    const Account = await Account.findOne({ user_name }).catch(err => { console.log('createUser: ', err.message)})
    
    if (user) {
      throw Error('Account already exists')
    }

    const newAccount = new Account(newAccountObj)
    const savedAccount = await newAccount.save().catch(err => { console.log('createUser: ', err.message)})

    if (!savedUser) {
      throw Error('Something went wrong saving the account')
    }

    res.status(200).json({ error: false })
  } catch(e) {
    res.status(500).end()
  }
}