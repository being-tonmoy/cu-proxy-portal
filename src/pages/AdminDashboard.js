import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import Swal from 'sweetalert2';
import { useAuth } from '../contexts/AuthContext';
import { getAllSubmissions, deleteStudentSubmission } from '../services/firestoreService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubmissions();
      setSubmissions(data);
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

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleDeleteSubmission = async (submission) => {
    const result = await Swal.fire({
      title: 'Delete Submission?',
      text: `Are you sure you want to delete ${submission.firstName} ${submission.lastName}'s submission?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, Delete'
    });

    if (result.isConfirmed) {
      try {
        await deleteStudentSubmission(submission.studentId, submission.facultyAlias, submission.department);
        setSubmissions(submissions.filter(s => s.id !== submission.id));
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Submission deleted successfully',
          confirmButtonColor: '#001f3f'
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete submission',
          confirmButtonColor: '#001f3f'
        });
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const stats = {
    totalSubmissions: submissions.length,
    totalFaculties: [...new Set(submissions.map(s => s.faculty))].length,
    totalDepartments: [...new Set(submissions.map(s => s.department))].length,
    sessions: [...new Set(submissions.map(s => s.session))]
  };

  const submissionsByFaculty = submissions.reduce((acc, s) => {
    acc[s.faculty] = (acc[s.faculty] || 0) + 1;
    return acc;
  }, {});

  const submissionsByDepartment = submissions.reduce((acc, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Student Information Form</title>
        <meta name="description" content="Admin dashboard for managing student submissions" />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 1 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Welcome, <strong>{user?.name}</strong> ({user?.role})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/setup')}
              sx={{ borderColor: '#003d7a', color: '#003d7a', fontWeight: 'bold' }}
            >
              Setup
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/submissions')}
              sx={{ borderColor: '#003d7a', color: '#003d7a', fontWeight: 'bold' }}
            >
              Manage Submissions
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/users')}
              sx={{ borderColor: '#003d7a', color: '#003d7a', fontWeight: 'bold' }}
            >
              Manage Users
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ borderColor: '#d32f2f', color: '#d32f2f', fontWeight: 'bold' }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                      Total Submissions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stats.totalSubmissions}
                    </Typography>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #0288d1 0%, #01579b 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                      Faculties
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stats.totalFaculties}
                    </Typography>
                  </Box>
                  <SchoolIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #00897b 0%, #004d40 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                      Departments
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stats.totalDepartments}
                    </Typography>
                  </Box>
                  <BarChartIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ background: 'linear-gradient(135deg, #6a1b9a 0%, #4a148c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                      Sessions
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                      {stats.sessions.length}
                    </Typography>
                  </Box>
                  <PeopleIcon sx={{ fontSize: 50, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Submissions by Faculty */}
        {Object.keys(submissionsByFaculty).length > 0 && (
          <Paper sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 2 }}>
              Submissions by Faculty
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(submissionsByFaculty).map(([faculty, count]) => (
                <Chip
                  key={faculty}
                  label={`${faculty}: ${count}`}
                  color="primary"
                  variant="outlined"
                  sx={{ fontSize: '14px' }}
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Submissions by Department */}
        {Object.keys(submissionsByDepartment).length > 0 && (
          <Paper sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
            <Typography variant="h6" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 2 }}>
              Submissions by Department
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(submissionsByDepartment)
                .sort((a, b) => b[1] - a[1])
                .map(([department, count]) => (
                  <Chip
                    key={department}
                    label={`${department}: ${count}`}
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: '14px' }}
                  />
                ))}
            </Box>
          </Paper>
        )}

        {/* Submissions Table */}
        <Paper sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ color: '#001f3f', fontWeight: 'bold' }}>
              All Submissions
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : submissions.length === 0 ? (
            <Alert severity="info" sx={{ m: 2 }}>
              No submissions yet
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#001f3f' }}>
                  <TableRow sx={{ background: '#001f3f' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Student ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Faculty</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Personal Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Institutional Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Session</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Year/Semester</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>Submitted</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: 'white', backgroundColor: '#001f3f' }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id} hover>
                      <TableCell sx={{ fontSize: '13px' }}>{submission.studentId}</TableCell>
                      <TableCell sx={{ fontSize: '13px' }}>
                        {submission.firstName} {submission.lastName}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px' }}>{submission.faculty}</TableCell>
                      <TableCell sx={{ fontSize: '13px' }}>{submission.department}</TableCell>
                      <TableCell sx={{ fontSize: '12px' }}>{submission.email}</TableCell>
                      <TableCell sx={{ fontSize: '12px' }}>
                        {submission.aliasEmail}@std.cu.ac.bd
                      </TableCell>
                      <TableCell sx={{ fontSize: '12px' }}>{submission.phoneNumber}</TableCell>
                      <TableCell sx={{ fontSize: '13px' }}>{submission.session}</TableCell>
                      <TableCell sx={{ fontSize: '12px' }}>
                        {submission.yearSemesterType === 'year' ? 'Year' : 'Semester'} {submission.yearSemesterValue}
                      </TableCell>
                      <TableCell sx={{ fontSize: '11px' }}>
                        {submission.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewSubmission(submission)}
                            sx={{ color: '#0288d1' }}
                          >
                            <VisibilityIcon />
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#001f3f', fontWeight: 'bold', backgroundColor: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
          Submission Details - {selectedSubmission?.firstName} {selectedSubmission?.lastName}
        </DialogTitle>
        <DialogContent dividers sx={{ py: 3 }}>
          {selectedSubmission && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Personal Information Section */}
              <Box>
                <Typography variant="h6" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 2, paddingBottom: 1, borderBottom: '2px solid #0288d1' }}>
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        First Name
                      </Typography>
                      <Typography variant="body2">{selectedSubmission.firstName}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Last Name
                      </Typography>
                      <Typography variant="body2">{selectedSubmission.lastName}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Student ID
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {selectedSubmission.studentId}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body2">{selectedSubmission.phoneNumber}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Contact Information Section */}
              <Box>
                <Typography variant="h6" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 2, paddingBottom: 1, borderBottom: '2px solid #00897b' }}>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Email Address
                      </Typography>
                      <Typography variant="body2">{selectedSubmission.email}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Institutional Email
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                        {selectedSubmission.aliasEmail}@std.cu.ac.bd
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Academic Information Section */}
              <Box>
                <Typography variant="h6" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 2, paddingBottom: 1, borderBottom: '2px solid #6a1b9a' }}>
                  Academic Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Faculty
                      </Typography>
                      <Typography variant="body2">{selectedSubmission.faculty}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Department
                      </Typography>
                      <Typography variant="body2">{selectedSubmission.department}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Session
                      </Typography>
                      <Typography variant="body2">{selectedSubmission.session}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Year / Semester
                      </Typography>
                      <Typography variant="body2">
                        {selectedSubmission.yearSemesterType === 'year' ? 'Year' : 'Semester'} - {selectedSubmission.yearSemesterValue}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Additional Information Section */}
              <Box>
                <Typography variant="h6" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 2, paddingBottom: 1, borderBottom: '2px solid #ff6f00' }}>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Terms Agreed
                      </Typography>
                      <Chip
                        label={selectedSubmission.agreeToTerms ? 'Yes' : 'No'}
                        color={selectedSubmission.agreeToTerms ? 'success' : 'error'}
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                        Submitted At
                      </Typography>
                      <Typography variant="body2">
                        {selectedSubmission.createdAt?.toDate?.().toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', padding: 2 }}>
          <Button onClick={() => setViewDialogOpen(false)} variant="contained" sx={{ backgroundColor: '#001f3f' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
