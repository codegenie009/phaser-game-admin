import Team from '../models/Team.js'

export async function getTeams(req, res) {
  let { page, rowsPerPage, sortOrder: { name, direction}, searchText } = req.body
  let count = await Team.count().catch(err => { console.log('getTeams: ', err.message)})
  let teams = null
  let searchPattern = new RegExp(searchText, 'i')
  if (name && direction) {
    teams = await Team.find({name: searchPattern})
                      .skip(page * rowsPerPage)
                      .limit(rowsPerPage)
                      .sort( { [name]: direction})
                      .catch(err => { console.log('get Teams: ', err.message)})
  } else {
    teams = await Team.find({ name: searchPattern })
                      .skip(page * rowsPerPage)
                      .limit(rowsPerPage)
                      .catch(err => { console.log('getUsers: ', err.message) })
  }

  if (!teams) {
    return res.status(500).end()
  }

  res.json( {list: teams, count})

}

export async function deleteTeam(req, res) {
  let result = await Team.deleteOne({_id: req.body.team_id})

  if (!result) {
    return res.status(500).end()
  }

  res.json({ error: false })
}

export async function updateTeam(req, res) {
  let team = await Team.findOne({ _id: req.body._id })
                       .catch(err => { console.log('updateTeam: ', err.message)})
  if (!team) {
    return res.status(500).end()
  }

  team.name = req.body.name
  team.member_count = req.body.member_count

  await team.save().catch(err => { console.log('updateUser: ', err.message)})
  
  res.json({ error: false })
}

export async function createTeam(req, res) {
  const { name, member_count } = req.body
  if (!name) {
    return res.status(400).json({ msg: 'Please enter team name' })
  }
  
  try {
    
    const team = await Team.findOne({ name }).catch(err => { console.log('createUser: ', err.message)})
    if (team) {
      throw Error('Team already exists')
    }
    
    const newTeam = new Team({
      name,
      member_count
    })
    
    const savedTeam = await newTeam.save().catch(err => { console.log('CreateTeam: ', err.message)})

    if (!savedTeam) {
      throw Error('Something went wrong saving the team')
    }

    res.status(200).json({ error: false })
  } catch(e) {
    res.status(500).end()
  }
}
