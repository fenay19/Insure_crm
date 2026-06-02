import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Checkbox,
  Paper,
  Typography
} from '@mui/material'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import adminMenuItems from 'admin-menu-items'
import { post, put } from '../../../../../api/api.js'

function findParentId(items, targetId, parentId = null) {
  for (const item of items) {
    if (item.id === targetId) return parentId
    if (item.children) {
      const found = findParentId(item.children, targetId, item.id)
      if (found) return found
    }
  }
  return null
}

function renderMenuItems(
  items,
  authorizedIds,
  actionPermissions,
  handleAuthorizationChange,
  handleActionChange,
  parentIndex = ''
) {
  return items.map((item, index) => {
    const fullIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`
    const hasChildren = item.children && item.children.length > 0

    const isSelectAllChecked =
      item.url &&
      ['Add', 'View', 'Edit', 'Delete'].every(
        (action) => actionPermissions[item.id]?.[action]
      )

    const row = (
      <TableRow key={item.id}>
        <TableCell align="center" sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}>
          {fullIndex}
        </TableCell>
        <TableCell align="center" sx={{ fontWeight: hasChildren ? 'bold' : 'normal' }}>
          {item.title || item.id || item.name || 'N/A'}
        </TableCell>
        <TableCell align="center">
          <Switch
            checked={!!authorizedIds[item.id]}
            onChange={(e) => handleAuthorizationChange(item.id, e.target.checked)}
            color="primary"
          />
        </TableCell>
        <TableCell align="center">
          {item.url && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <div>
                <Checkbox
                  checked={isSelectAllChecked}
                  onChange={(e) =>
                    handleActionChange(item.id, null, e.target.checked, true)
                  }
                  color="primary"
                  size="small"
                />
                <Typography variant="body2">Select All</Typography>
              </div>
              {['Add', 'View', 'Edit', 'Delete'].map((action) => (
                <div key={action} style={{ display: 'inline-block', marginRight: '10px' }}>
                  <Checkbox
                    checked={!!actionPermissions[item.id]?.[action]}
                    onChange={(e) =>
                      handleActionChange(item.id, action, e.target.checked)
                    }
                    color="primary"
                    size="small"
                  />
                  <Typography variant="body2">{action}</Typography>
                </div>
              ))}
            </div>
          )}
        </TableCell>
      </TableRow>
    )

    if (hasChildren) {
      return (
        <React.Fragment key={item.id}>
          {row}
          {renderMenuItems(
            item.children,
            authorizedIds,
            actionPermissions,
            handleAuthorizationChange,
            handleActionChange,
            fullIndex
          )}
        </React.Fragment>
      )
    }

    return row
  })
}

const SystemRights = ({ setValue, setStoredAllData, storedAllData }) => {
  const [authorizedIds, setAuthorizedIds] = useState({})
  const [actionPermissions, setActionPermissions] = useState({})

  useEffect(() => {
    if (storedAllData.systemRights) {
      setAuthorizedIds(storedAllData.systemRights.authorizedIds || {})
      setActionPermissions(storedAllData.systemRights.actionPermissions || {})
    }
  }, [storedAllData.systemRights])

  const handleAuthorizationChange = (id, isAuthorized) => {
    const updatedIds = {}
    const updatedActions = {}

    const traverse = (items) => {
      for (const item of items) {
        if (item.id === id || updatedIds[item.id]) {
          updatedIds[item.id] = isAuthorized

          if (item.url) {
            updatedActions[item.id] = {
              Add: isAuthorized,
              View: isAuthorized,
              Edit: isAuthorized,
              Delete: isAuthorized
            }
          }

          if (item.children && item.children.length > 0) {
            for (const child of item.children) {
              updatedIds[child.id] = isAuthorized
              if (child.url) {
                updatedActions[child.id] = {
                  Add: isAuthorized,
                  View: isAuthorized,
                  Edit: isAuthorized,
                  Delete: isAuthorized
                }
              }

              if (child.children && child.children.length > 0) {
                traverse([child])
              }
            }
          }
        } else if (item.children) {
          traverse(item.children)
        }
      }
    }

    traverse(adminMenuItems.items)

    setAuthorizedIds((prev) => ({
      ...prev,
      ...updatedIds
    }))

    setActionPermissions((prev) => ({
      ...prev,
      ...updatedActions
    }))
  }

  const handleActionChange = (id, action, isChecked, isSelectAll = false) => {
    setActionPermissions((prev) => {
      const updatedPermissions = { ...prev }
      if (!updatedPermissions[id]) updatedPermissions[id] = {}

      if (isSelectAll) {
        ['Add', 'View', 'Edit', 'Delete'].forEach((act) => {
          updatedPermissions[id][act] = isChecked
        })
      } else {
        updatedPermissions[id][action] = isChecked
      }

      return updatedPermissions
    })

    // If any action is checked, authorize the parent and current item
    if (isChecked) {
      const parentId = findParentId(adminMenuItems.items, id)
      if (parentId) {
        setAuthorizedIds((prev) => ({
          ...prev,
          [parentId]: true
        }))
      }
      setAuthorizedIds((prev) => ({
        ...prev,
        [id]: true
      }))
    } else {
      // If all actions are unchecked, de-authorize the parent and current item
      setActionPermissions((prev) => {
        const currPerms = prev[id] || {}
        const actionsArr = ['Add', 'View', 'Edit', 'Delete']
        // If it's Select All, all will become unchecked
        let allUnchecked = false
        if (isSelectAll) {
          allUnchecked = true
        } else {
          // If not Select All, check if all actions are now unchecked
          const newPerms = { ...currPerms, [action]: false }
          allUnchecked = actionsArr.every((act) => !newPerms[act])
        }
        if (allUnchecked) {
          setAuthorizedIds((prevAuth) => ({
            ...prevAuth,
            [id]: false
          }))
          const parentId = findParentId(adminMenuItems.items, id)
          if (parentId) {
            // Check if all children of parent are unauthorized, then de-authorize parent
            const findItem = (items, searchId) => {
              for (const item of items) {
                if (item.id === searchId) return item
                if (item.children) {
                  const found = findItem(item.children, searchId)
                  if (found) return found
                }
              }
              return null
            }
            const parentItem = findItem(adminMenuItems.items, parentId)
            if (parentItem && parentItem.children) {
              const allChildrenUnauthorized = parentItem.children.every(
                (child) => !(authorizedIds[child.id])
              )
              if (allChildrenUnauthorized) {
                setAuthorizedIds((prevAuth) => ({
                  ...prevAuth,
                  [parentId]: false
                }))
              }
            }
          }
        }
        return prev
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (storedAllData.submittedFormId) {
        const response = await put(`administrative/systemRights/${storedAllData.submittedFormId}`, {
          authorizedIds,
          actionPermissions
        })
        if (response.success === true) {
          setStoredAllData((prev) => ({
            ...prev,
            systemRights: response?.data?.systemRights
          }))
          toast.success(response.message)
          setValue((prev) => prev + 1)
        } else {
          toast.error(response.message)
        }
      } else {
        toast.error('User ID is missing. Please load the user first.')
        setValue(0)
      }
    } catch (error) {
      toast.error('An error occurred while updating system rights.')
    }
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Card sx={{ maxWidth: '100%', boxShadow: 6, borderRadius: 4 }}>
        <CardHeader
          title='System Rights Management'
          titleTypographyProps={{
            variant: 'h5',
            align: 'center',
            sx: { color: '#344767', fontWeight: 'bold' }
          }}
          sx={{ backgroundColor: '#e3f2fd', borderRadius: '8px', padding: 2 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Sr. No.</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Module Name</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Authorization</TableCell>
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>System Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {renderMenuItems(
                    adminMenuItems.items,
                    authorizedIds,
                    actionPermissions,
                    handleAuthorizationChange,
                    handleActionChange
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 2 }}>
              <Button
                type='submit'
                variant='contained'
                color='secondary'
                disabled={false}
                sx={{
                  padding: '10px 30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#43a047'
                  }
                }}
              >
                Submit Rights
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SystemRights