import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';
import { 
  getAllSubmissions, 
  deleteStudentSubmission,
  updateSubmission,
  getFacultyData
} from '../services/firestoreService';

const SubmissionManagement = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [facultyData, setFacultyData] = useState({});
  const [filterFaculty, setFilterFaculty] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  useEffect(() => {
    loadSubmissions();
    loadFacultyData();
  }, []);

  useEffect(() => {
    let filtered = [...submissions];

    // Apply search filter across all fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(sub => {
        const searchString = JSON.stringify(sub).toLowerCase();
        return searchString.includes(query);
      });
    }

    // Apply faculty filter
    if (filterFaculty) {
      filtered = filtered.filter(sub => sub.faculty === filterFaculty);
    }

    // Apply department filter
    if (filterDepartment) {
      filtered = filtered.filter(sub => sub.department === filterDepartment);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredSubmissions(filtered);
  }, [submissions, searchQuery, order, orderBy, filterFaculty, filterDepartment]);

  const loadFacultyData = async () => {
    try {
      const data = await getFacultyData();
      if (data) {
        setFacultyData(data);
      }
    } catch (error) {
      console.error('Error loading faculty data:', error);
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubmissions();
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load submissions',
        confirmButtonColor: '#001f3f'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleEditSubmission = (submission) => {
    setEditingSubmission(submission);
    setEditFormData({ ...submission });
    setEditDialogOpen(true);
  };

  const handleSaveSubmission = async () => {
    try {
      setLoading(true);
      await updateSubmission(
        editingSubmission.studentId,
        editingSubmission.facultyAlias,
        editingSubmission.department,
        {
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          email: editFormData.email,
          phoneNumber: editFormData.phoneNumber,
          aliasEmail: editFormData.aliasEmail,
          session: editFormData.session,
          yearSemesterType: editFormData.yearSemesterType,
          yearSemesterValue: editFormData.yearSemesterValue
        }
      );
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Submission updated successfully',
        timer: 2000,
        confirmButtonColor: '#001f3f'
      });
      setEditDialogOpen(false);
      await loadSubmissions();
    } catch (error) {
      console.error('Error updating submission:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update submission',
        confirmButtonColor: '#001f3f'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (submission) => {
    const result = await Swal.fire({
      title: 'Confirm Delete',
      text: `Are you sure you want to delete ${submission.firstName} ${submission.lastName}'s submission?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#757575',
      confirmButtonText: 'Delete'
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await deleteStudentSubmission(submission.studentId, submission.facultyAlias, submission.department);
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Submission deleted successfully',
          timer: 2000,
          confirmButtonColor: '#001f3f'
        });
        await loadSubmissions();
      } catch (error) {
        console.error('Error deleting submission:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete submission',
          confirmButtonColor: '#001f3f'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const downloadCSV = () => {
    if (filteredSubmissions.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Data',
        text: 'No submissions to download',
        confirmButtonColor: '#001f3f'
      });
      return;
    }

    const headers = [
      'Student ID',
      'First Name',
      'Last Name',
      'Email',
      'Alias Email',
      'Phone',
      'Faculty',
      'Department',
      'Session',
      'Year/Semester',
      'Submitted Date'
    ];

    const data = filteredSubmissions.map(sub => [
      sub.studentId,
      sub.firstName,
      sub.lastName,
      sub.email,
      sub.aliasEmail,
      sub.phoneNumber,
      sub.faculty,
      sub.department,
      sub.session,
      `${sub.yearSemesterType} ${sub.yearSemesterValue}`,
      new Date(sub.createdAt?.toDate?.() || sub.createdAt).toLocaleString()
    ]);

    // Create CSV content
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
      csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    Swal.fire({
      icon: 'success',
      title: 'Downloaded',
      text: `${filteredSubmissions.length} submissions exported to CSV`,
      timer: 2000,
      confirmButtonColor: '#001f3f'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const departmentOptions = (() => {
    if (!filterFaculty) return [];
    // Find the faculty data entry that matches the selected faculty name
    for (const [, info] of Object.entries(facultyData)) {
      if (info.name === filterFaculty) {
        return info.departments || [];
      }
    }
    return [];
  })();

  const getTableHeaders = () => {
    return [
      { id: 'studentId', label: 'Student ID' },
      { id: 'firstName', label: 'First Name' },
      { id: 'lastName', label: 'Last Name' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'department', label: 'Department' },
      { id: 'email', label: 'Email' },
      { id: 'session', label: 'Session' },
      { id: 'createdAt', label: 'Submitted Date' }
    ];
  };

  return (
    <>
      <Helmet>
        <title>Submission Management - Student Information Form</title>
        <meta name="description" content="Manage student form submissions" />
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ color: '#001f3f', fontWeight: 'bold' }}>
            Submission Management
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadCSV}
              sx={{ bgcolor: '#00897b', '&:hover': { bgcolor: '#004d40' } }}
            >
              Download CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderColor: '#d32f2f', color: '#d32f2f' }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search all fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                helperText="Searches: Name, Email, Faculty, Department, Session, ID"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: '#999' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="faculty-select-label">Faculty</InputLabel>
                <Select
                  labelId="faculty-select-label"
                  id="faculty-select"
                  value={filterFaculty}
                  onChange={(e) => {
                    setFilterFaculty(e.target.value);
                    setFilterDepartment('');
                  }}
                  label="Faculty"
                  sx={{
                    width: '100%',
                    minWidth: '200px',
                    '& .MuiOutlinedInput-input': {
                      padding: '10px 14px'
                    }
                  }}
                >
                  <MenuItem value="">All Faculties</MenuItem>
                  {Object.entries(facultyData).map(([alias, info]) => (
                    <MenuItem key={alias} value={info.name}>
                      {info.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" disabled={!filterFaculty}>
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                  labelId="department-select-label"
                  id="department-select"
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  label="Department"
                  sx={{
                    width: '100%',
                    minWidth: '200px',
                    '& .MuiOutlinedInput-input': {
                      padding: '10px 14px'
                    }
                  }}
                >
                  <MenuItem value="">All Departments</MenuItem>
                  {departmentOptions.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={3}>
              <Box sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: '4px', textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold' }}>
                  {filteredSubmissions.length} submissions found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Submissions Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: '#001f3f' }}>
                <TableRow>
                  {getTableHeaders().map((header) => (
                    <TableCell
                      key={header.id}
                      sx={{ 
                        color: 'white', 
                        fontWeight: 'bold',
                        backgroundColor: '#001f3f'
                      }}
                      sortDirection={orderBy === header.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === header.id}
                        direction={orderBy === header.id ? order : 'asc'}
                        onClick={() => handleRequestSort(header.id)}
                        sx={{
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          },
                          '& .MuiTableSortLabel-icon': { 
                            color: 'white !important'
                          },
                          '&.Mui-active': {
                            color: 'white'
                          }
                        }}
                      >
                        {header.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 'bold',
                      backgroundColor: '#001f3f'
                    }} 
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={getTableHeaders().length + 1} align="center" sx={{ py: 3 }}>
                      No submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id} hover>
                      <TableCell>{submission.studentId}</TableCell>
                      <TableCell>{submission.firstName}</TableCell>
                      <TableCell>{submission.lastName}</TableCell>
                      <TableCell>{submission.faculty}</TableCell>
                      <TableCell>{submission.department}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>{submission.session}</TableCell>
                      <TableCell>
                        {new Date(submission.createdAt?.toDate?.() || submission.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEditSubmission(submission)}
                            sx={{ color: '#1976d2' }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSubmission(submission)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Edit Submission Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: '#001f3f', color: 'white', fontWeight: 'bold' }}>
            Edit Submission
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Student ID - Read Only */}
              <TextField
                label="Student ID"
                fullWidth
                value={editFormData.studentId || ''}
                disabled
                InputProps={{ readOnly: true }}
              />
              
              {/* First Name and Last Name Row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={editFormData.firstName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  value={editFormData.lastName || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
                />
              </Box>

              {/* Faculty and Department - Read Only */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Faculty"
                  fullWidth
                  value={editFormData.faculty || ''}
                  disabled
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  label="Department"
                  fullWidth
                  value={editFormData.department || ''}
                  disabled
                  InputProps={{ readOnly: true }}
                />
              </Box>

              {/* Email and Phone Row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Personal Email"
                  type="email"
                  fullWidth
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
                <TextField
                  label="Phone"
                  fullWidth
                  value={editFormData.phoneNumber || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                />
              </Box>

              {/* Alias Email */}
              <TextField
                label="Alias Email (Student Email)"
                fullWidth
                value={editFormData.aliasEmail || ''}
                onChange={(e) => setEditFormData({ ...editFormData, aliasEmail: e.target.value })}
              />

              {/* Session */}
              <TextField
                label="Session"
                fullWidth
                value={editFormData.session || ''}
                onChange={(e) => setEditFormData({ ...editFormData, session: e.target.value })}
              />

              {/* Year/Semester Type and Value Row */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Year/Semester Type"
                  fullWidth
                  value={editFormData.yearSemesterType || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, yearSemesterType: e.target.value })}
                  select
                >
                  <MenuItem value="year">Year</MenuItem>
                  <MenuItem value="semester">Semester</MenuItem>
                </TextField>
                <TextField
                  label="Year/Semester Value"
                  fullWidth
                  value={editFormData.yearSemesterValue || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, yearSemesterValue: e.target.value })}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveSubmission}
              variant="contained"
              sx={{ bgcolor: '#003d7a', '&:hover': { bgcolor: '#002147' } }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default SubmissionManagement;
