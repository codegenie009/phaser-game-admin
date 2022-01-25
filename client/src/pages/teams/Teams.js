import React, { useState, useEffect } from "react"
import { Grid, IconButton, Tooltip } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import MUIDataTable from "mui-datatables"
import {
  Person as AccountIcon,
  DeleteOutline as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon
} from "@material-ui/icons";
// components
import PageTitle from "../../components/PageTitle/PageTitle";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification";
import { getTeams, deleteTeam, updateTeam, createTeam as createTeamApi } from '../../api'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers'

const useStyles = makeStyles(theme => ({
  tableOverflow: {
    overflow: 'auto'
  },
  editModal: {
    width: '500px'
  }
}))

function CustomToolbar({ handleShowCreateModal }) {
  return (
    <>
      <Tooltip title={"custom icon"}>
        <IconButton onClick={handleShowCreateModal}>
          <AddIcon />
        </IconButton>
      </Tooltip>
    </>
  )
}

export default function Teams() {
  const classes = useStyles();
  const [tableData, setTableData] = useState([])
  const [pageData, setPageData] = useState({
    rowsPerPage: 5,
    page: 0,
    count: 0,
    sortOrder: {},
    searchText: ''
  })
  const [open, setOpen] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [curId, setCurId] = useState('')
  const [curTeam, setCurTeam] = useState({})
  const [createTeam, setCreateTeam] = useState({
    name: '',
    member_count: 0,
  })
  const [createModal, setCreateModal] = useState(false)

  const columns = [
    {
      label: 'No',
      name: 'No',
      options: {
        sort: false,
        filter: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
              <span>{(pageData.rowsPerPage * pageData.page) + parseInt(rowIndex) + 1}</span>
            )
        }
      },
    },
    {
      label: 'Name',
      name: 'name',
      options: {
        filter: true,
        sortThirdClickReset: true,
        sortDescFirst: true,
      }
    },      
    {
      label: 'Member Count',
      name: 'member_count',
      options: {
        filter: true,
        sortThirdClickReset: true,
      }
    },
    {
      label: 'Creation Date',
      name: 'createdAt',
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <span>{ tableData[dataIndex].createdAt.substring(0, 10) }</span>
            )
        }
      }
    },
    {
      label: 'Actions',
      name: '-',
      options: {
        filter: false,
        sort: false,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <>
              <IconButton
                color="secondary"
                onClick={(e) => handleOpen(tableData[dataIndex]._id)}
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={(e) => handleEdit(tableData[dataIndex])}
              >
                <EditIcon />
              </IconButton>
            </>
        )
        }
      }
    }
  ]

  const options = {
    filter: true,
    filterType: 'dropdown',
    responsive: 'vertical',
    serverSide: true,
    count: pageData.count,
    rowsPerPage: pageData.rowsPerPage,
    selectableRowsHideCheckboxes: true,
    rowsPerPageOptions: [5, 10, 20],
    sortOrder: {},
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          getTeamsForTable({ page: tableState.page })
          break
        case 'changeRowsPerPage':
          getTeamsForTable({ rowsPerPage: tableState.rowsPerPage })
          break
        case 'sort':
          getTeamsForTable({ sortOrder: tableState.sortOrder })
          break
        case 'search':
          getTeamsForTable({ searchText: tableState.searchText || '' })
          break
        default:
          // console.log('action not handled.')
      }
    },
    customToolbar: () => ( <CustomToolbar handleShowCreateModal={handleCreateOpen} /> )
  }



  useEffect(() => {
    getTeamsForTable({})
  }, [])

  return (
    <>
      <PageTitle title="Team management" />
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Team List"
            data={tableData}
            columns={columns}
            options={options}
          />
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure to delete this team?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This operation could not be irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editModal} onClose={() => setEditModal(false)}>
        <DialogTitle id="max-width-dialog-title">Edit Team</DialogTitle>
        <DialogContent className={classes.editModal}>
          <DialogContentText>
            You can edit a Team's profile.
          </DialogContentText>
          {
            curTeam._id && (
              <form className={classes.form} noValidate>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    value={curTeam.name}
                    onChange={e => { setCurTeam({ ...curTeam, name: e.target.value }) }}
                    label="Name"
                    type="text"
                    fullWidth
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="member_count"
                    value={curTeam.email}
                    onChange={e => { setCurTeam({ ...curTeam, member_count: e.target.value }) }}
                    label="Member Count"
                    type="number"
                    fullWidth
                  />
                </FormControl>
              </form>)
          }
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
          <Button onClick={() => setEditModal(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={createModal} onClose={() => handleCreateClose()}>
        <DialogTitle id="max-width-dialog-title">Create Team</DialogTitle>
        <DialogContent className={classes.editModal}>
          <DialogContentText>
            You can create a team.
          </DialogContentText>
            <form className={classes.form} noValidate>
              <FormControl className={classes.formControl} fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  value={createTeam.name}
                  onChange={e => { setCreateTeam({ ...createTeam, name: e.target.value }) }}
                  label="Name"
                  type="text"
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="member_count"
                  value={createTeam.member_count}
                  onChange={e => { setCreateTeam({ ...createTeam, member_count: e.target.value }) }}
                  label="Member Count"
                  type="number"
                  fullWidth
                />
              </FormControl>
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
          <Button onClick={() => handleCreateClose()} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );

  function getTeamsForTable({ rowsPerPage = pageData.rowsPerPage, page = pageData.page, sortOrder = pageData.sortOrder, searchText = pageData.searchText }) {
    getTeams({ rowsPerPage, page, sortOrder, searchText })
      .then(res => {
        setPageData({
          rowsPerPage,
          page,
          sortOrder,
          searchText,
          count: res.data.count
        })
        setTableData(res.data.list)
      })
      .catch(err => {
        sendNotification({
            type: 'message',
            message: 'An error occured during fetching user list.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function handleOpen(user_id) {
    setCurId(user_id)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleEdit(user) {
    setCurTeam(user)
    setEditModal(true)
  }

  function handleCreateOpen() {
    setCreateTeam({ name: '', email: '', password: '' })
    setCreateModal(true)
  }

  function handleCreateClose() {
    setCreateModal(false)
  }

  function handleDelete() {
    deleteTeam(curId)
      .then(res => {
        handleClose()

        sendNotification({
            type: 'message',
            message: 'Selected team successfully deleted.',
            variant: 'contained',
            color: 'primary',
        }, {
          type: 'success'
        })

        getTeamsForTable({})
      })
      .catch(err => {
        sendNotification({
            type: 'message',
            message: 'An error occured during fetching user list.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function handleUpdate() {
    updateTeam(curTeam)
      .then(res => {
        setEditModal(false)

        sendNotification({
            type: 'message',
            message: 'Selected user successfully updated.',
            variant: 'contained',
            color: 'primary',
        }, {
          type: 'success'
        })

        getTeamsForTable({})
      })
      .catch(err => {
        sendNotification({
            type: 'message',
            message: 'An error occured during saving a user.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function handleCreate() {
    if (!createTeam.name || !createTeam.member_count) {
      sendNotification({
          type: 'message',
          message: 'You must fill all informations.',
          variant: 'contained',
          color: 'secondary',
      }, {
        type: 'error'
      })

      return
    }

    createTeamApi(createTeam)
      .then(res => {
        handleCreateClose()

        sendNotification({
            type: 'message',
            message: 'A user successfully created.',
            variant: 'contained',
            color: 'primary',
        }, {
          type: 'success'
        })

        getTeamsForTable({})
      })
      .catch(err => {
        sendNotification({
            type: 'message',
            message: 'An error occured during creating a user.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function sendNotification(componentProps, options) {
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      {
        ...options,
        position: toast.POSITION.TOP_RIGHT,
        progressClassName: classes.progress,
        className: classes.notification
      }
    );
  }
}
