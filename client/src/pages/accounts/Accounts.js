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
import { getAccounts, deleteAccount, updateAccount, createAccount as createAccountApi } from '../../api'
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
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification";

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

export default function Accounts({ SendNotification }) {
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
  const [curAccount, setCurAccount] = useState({})
  const [createAccount, setCreateAccount] = useState({
    name: '',
    player_num: '',
    total_point: '',
    cur_point: '',
    unlocked_skin: '',
    country: '',
    os: '',
    mobile_type: '',
    referral: '',
    account_type: '',
    team: '',
    team_join_date: '',
    team_exit_date: '',
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
      label: 'Player Number',
      name: 'player_num',
      options: {
        filter: true,
        sortThirdClickReset: true,
      }
    },
    {
      label: 'Total Point',
      name: 'total_point',
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <span>{ tableData[dataIndex].register_date.substring(0, 10) }</span>
            )
        }
      }
    },
    {
      label: 'Cur Point',
      name: 'cur_point',
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
      label: 'Unlocked Skin',
      name: 'unlocked_skin',
      options: {
        filter: true,
        sortThirdClickReset: true,
        sortDescFirst: true,
      }
    },      
    {
      label: 'Country',
      name: 'country',
      options: {
        filter: true,
        sortThirdClickReset: true,
      }
    },
    {
      label: 'OS',
      name: 'os',
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <span>{ tableData[dataIndex].register_date.substring(0, 10) }</span>
            )
        }
      }
    },
    {
      label: 'Mobile Type',
      name: 'mobile_type',
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <span>{ tableData[dataIndex].register_date.substring(0, 10) }</span>
            )
        }
      }
    },
    {
      label: 'referral',
      name: 'referral',
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <span>{ tableData[dataIndex].register_date.substring(0, 10) }</span>
            )
        }
      }
    },
    {
      label: 'account_type',
      name: 'os',
      options: {
        filter: false,
        sortThirdClickReset: true,
        customBodyRenderLite: (dataIndex, rowIndex) => {
          return (
            <span>{ tableData[dataIndex].register_date.substring(0, 10) }</span>
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
    // filter: true,
    // filterType: 'dropdown',
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
          getAccountsForTable({ page: tableState.page })
          break
        case 'changeRowsPerPage':
          getAccountsForTable({ rowsPerPage: tableState.rowsPerPage })
          break
        case 'sort':
          getAccountsForTable({ sortOrder: tableState.sortOrder })
          break
        case 'search':
          getAccountsForTable({ searchText: tableState.searchText || '' })
          break
        default:
          // console.log('action not handled.')
      }
    },
    // customToolbar: () => ( <CustomToolbar handleShowCreateModal={handleCreateOpen} /> )
  }



  useEffect(() => {
    getAccountsForTable({})
  }, [])

  return (
    <>
      <PageTitle title="Account management" />
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <MUIDataTable
            title="Account List"
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
        <DialogTitle id="alert-dialog-title">Are you sure to delete this account?</DialogTitle>
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
        <DialogTitle id="max-width-dialog-title">Edit Account</DialogTitle>
        <DialogContent className={classes.editModal}>
          <DialogContentText>
            You can edit a account's profile.
          </DialogContentText>
          {
            curAccount._id && (
              <form className={classes.form} noValidate>
                <FormControl className={classes.formControl} fullWidth>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    value={curAccount.name}
                    onChange={e => { setCurAccount({ ...curAccount, name: e.target.value }) }}
                    label="Name"
                    type="text"
                    fullWidth
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    value={curAccount.email}
                    onChange={e => { setCurAccount({ ...curAccount, email: e.target.value }) }}
                    label="Email Address"
                    type="email"
                    fullWidth
                  />
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      label="Material Date Picker"
                      variant="inline"
                      value={curAccount.register_date}
                      format="yyyy/MM/dd hh:mm"
                      onChange={e => { setCurAccount({ ...curAccount, register_date: e.target.value }) }}
                    />
                  </MuiPickersUtilsProvider>
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
        <DialogTitle id="max-width-dialog-title">Create Account</DialogTitle>
        <DialogContent className={classes.editModal}>
          <DialogContentText>
            You can create a account.
          </DialogContentText>
            <form className={classes.form} noValidate>
              <FormControl className={classes.formControl} fullWidth>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  value={createAccount.name}
                  onChange={e => { setCreateAccount({ ...createAccount, name: e.target.value }) }}
                  label="Name"
                  type="text"
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="email"
                  value={createAccount.email}
                  onChange={e => { setCreateAccount({ ...createAccount, email: e.target.value }) }}
                  label="Email Address"
                  type="email"
                  fullWidth
                />
                <TextField
                  margin="dense"
                  id="password"
                  value={createAccount.password}
                  onChange={e => { setCreateAccount({ ...createAccount, password: e.target.value }) }}
                  label="Password"
                  type="text"
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

  function getAccountsForTable({ rowsPerPage = pageData.rowsPerPage, page = pageData.page, sortOrder = pageData.sortOrder, searchText = pageData.searchText }) {
    getAccounts({ rowsPerPage, page, sortOrder, searchText })
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
        SendNotification({
            type: 'message',
            message: 'An error occured during fetching account list.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function handleOpen(account_id) {
    setCurId(account_id)
    setOpen(true)
  }

  function handleClose() {
    setOpen(false)
  }

  function handleEdit(account) {
    setCurAccount(account)
    setEditModal(true)
  }

  function handleCreateOpen() {
    // setCreateAccount({ name: '', email: '', password: '' })
    // setCreateModal(true)
  }

  function handleCreateClose() {
    setCreateModal(false)
  }

  function handleDelete() {
    deleteAccount(curId)
      .then(res => {
        handleClose()

        SendNotification({
            type: 'message',
            message: 'Selected account successfully deleted.',
            variant: 'contained',
            color: 'primary',
        }, {
          type: 'success'
        })

        getAccountsForTable({})
      })
      .catch(err => {
        SendNotification({
            type: 'message',
            message: 'An error occured during fetching account list.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function handleUpdate() {
    updateAccount(curAccount)
      .then(res => {
        setEditModal(false)

        SendNotification({
            type: 'message',
            message: 'Selected account successfully updated.',
            variant: 'contained',
            color: 'primary',
        }, {
          type: 'success'
        })

        getAccountsForTable({})
      })
      .catch(err => {
        SendNotification({
            type: 'message',
            message: 'An error occured during saving a account.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function handleCreate() {
    if (!createAccount.name || !createAccount.email || !createAccount.password) {
      SendNotification({
          type: 'message',
          message: 'You must fill all informations.',
          variant: 'contained',
          color: 'secondary',
      }, {
        type: 'error'
      })

      return
    }

    createAccountApi(createAccount)
      .then(res => {
        handleCreateClose()

        SendNotification({
            type: 'message',
            message: 'A account successfully created.',
            variant: 'contained',
            color: 'primary',
        }, {
          type: 'success'
        })

        getAccountsForTable({})
      })
      .catch(err => {
        SendNotification({
            type: 'message',
            message: 'An error occured during creating a account.',
            variant: 'contained',
            color: 'secondary',
        }, {
          type: 'error'
        })
      })
  }

  function SendNotification(componentProps, options) {
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
