import { Avatar, Box, Button, Card, CardActions, CardContent, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Paper, styled, TableContainer, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import CallIcon from '@mui/icons-material/Call';

const ProfileAvatar = styled(Avatar)({
    width: 80,
    height: 80,
    margin: "20px auto",
    border: "4px solid #fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});
const InfoContainer = styled(Box)({
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    gap: "10px",
  });
  
const StudentCards = () => {
    // State for search
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        standard: '',
        dob: '',
        phone: '',
        skills: []
    })
    const [students, setStudents] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(null);

    // Validation start
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        standard: '',
        dob: '',
        phone: ''
    });
    // validation s
    //skllis
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [allSkillsSelected, setAllSkillsSelected] = useState(false);

    const [profileImage, setProfileImage] = useState(null); // State for the profile image

    // Function to load students from localStorage when the component mounts
    useEffect(() => {
        const savedStudents = JSON.parse(localStorage.getItem('students'));
        if (savedStudents) {
            setStudents(savedStudents);
        }
    }, []);

    // Function to save students to localStorage
    const saveStudentsToLocalStorage = (students) => {
        localStorage.setItem('students', JSON.stringify(students));
    };

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
        setEditOpen(false);
    }

    const handleAddStudent = () => {
        if (validateForm()) {
        const newStudent = { ...profile, profile: profileImage };
        const updatedStudents = [...students, newStudent];
        setStudents(updatedStudents);
        saveStudentsToLocalStorage(updatedStudents); // Save to localStorage
        setProfile({ name: '', email: '', standard: '', dob: '', phone: '', skills: [] });
        setOpen(false); // Close the dialog
        }
    };


    const handleEditClick = (index) => {
        setCurrentIndex(index);
        setProfileImage(null);
        setProfile({ ...students[index] }); // Pre-fill the form with the student's details
        setEditOpen(true);
    }

    const handleEditStudent = () => {
        if (validateForm()) {
        const updatedStudents = [...students];
        updatedStudents[currentIndex] = { ...profile, profile: profileImage }; // Update the student's details
        setStudents(updatedStudents);
        saveStudentsToLocalStorage(updatedStudents);
        setProfile({ name: '', email: '', standard: '', dob: '', phone: '', skills: [], profileImage: {} });
        setEditOpen(false);
        }
    }


    const handleDeleteStudent = (index) => {
        const updatedStudents = students.filter((_, idx) => idx !== index);
        setStudents(updatedStudents);
        saveStudentsToLocalStorage(updatedStudents); // Save to localStorage
    };

    const handleAddSkill = (skillName, proficiency) => {
        const newSkill = { name: skillName, proficiency };
        setProfile({
            ...profile,
            skills: [...profile.skills, newSkill]
        });
    };

    const handleDeleteSkills = () => {
        const filteredSkills = profile.skills.filter((skill) => !selectedSkills.includes(skill.name));
        setProfile({ ...profile, skills: filteredSkills });
        setSelectedSkills([]); // Clear selected skills after deletion
    };
    const handleSkillSelection = (skillName) => {
        setSelectedSkills((prev) =>
            prev.includes(skillName)
                ? prev.filter((skill) => skill !== skillName)
                : [...prev, skillName]
        );
    };

    const toggleSelectAll = () => {
        if (allSkillsSelected) {
            setSelectedSkills([]);
        } else {
            setSelectedSkills(profile.skills.map((skill) => skill.name));
        }
        setAllSkillsSelected(!allSkillsSelected);
    };



    // Handle file input change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };
    // Filter students based on search query and skills
    const filteredStudents = students.filter(student =>
        student.skills.some(skill =>
            skill.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );


     // Validate the profile form
     const validateForm = () => {
        const newErrors = { ...errors };
        let isValid = true;

        if (!profile.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else {
            newErrors.name = '';
        }

        if (!profile.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else {
            newErrors.email = '';
        }
        if (!profile.standard) {
            newErrors.standard = 'Standard is required';
            isValid = false;
        } else {
            newErrors.standard = '';
        }

        if (!profile.dob) {
            newErrors.dob = 'DOB is required';
            isValid = false;
        } else {
            newErrors.dob = '';
        }
        if (!profile.phone) {
            newErrors.phone = 'Phone is required';
            isValid = false;
        } else {
            newErrors.phone = '';
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <div className='main'>
            <h1>Student Profile Management System</h1>

            {/* Search Bar for filtering skills */}
            <Box display="flex" justifyContent="center" marginBottom={2}>
                <TextField
                    label="Search by Skill"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Box>

            <Box display='flex' justifyContent='center' alignItems='center' height='20%' border='ActiveBorder'>
                <TableContainer component={Paper} >
                    <Box display='flex' justifyContent='flex-start'>
                        <Button variant='contained' onClick={handleClickOpen}>Add Student</Button>
                    </Box>

                    {/* Student Profile Cards filter applird*/}
                    <Box display="flex" flexWrap="wrap" justifyContent="center" marginTop="20px">
                        {filteredStudents.map((student, index) => (
                            <Card key={index} sx={{ width: 300, margin: 2 }}>
                                <CardContent>
                                    <ProfileAvatar src={student.profile} /> 
                                    <InfoContainer>
                                    <PersonIcon size={15} sx={{  color: "#666" }}/>
                                    <Typography variant="h6" gutterBottom>{student.name}</Typography>
                                    </InfoContainer>
                                    <InfoContainer>
                                    <EmailIcon size={15} sx={{ color: "#666" }}/>
                                    <Typography variant="body2" color="textSecondary"  > Email: {student.email}</Typography>
                                    </InfoContainer>
                                    <InfoContainer>
                                        <FilePresentIcon size={15} sx={{ color: "#666" }}/>
                                    <Typography variant="body2" color="textSecondary"> Standard: {student.standard}</Typography>
                                    </InfoContainer>
                                    <InfoContainer>
                                    <CakeIcon size={15} sx={{ color: "#666" }}/>
                                    <Typography variant="body2" color="textSecondary"> DOB:{student.dob}</Typography>
                                        </InfoContainer>         
                                                          
                                    <InfoContainer>
                                    <CallIcon size={15} sx={{ color: "#666" }}/>    
                                        <Typography variant="body2" color="textSecondary"> Phone: {student.phone}</Typography>
                                    </InfoContainer>
                                    
                                    {/* Skills */}
                                    <Typography variant="body2" color="textSecondary">Skills:</Typography>
                                    {student.skills.map((skill, idx) => (
                                        <Typography key={idx} variant="body2" color="textSecondary">
                                            {skill.name} ({skill.proficiency})
                                        </Typography>
                                    ))}
                                </CardContent>
                                <CardActions sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Button size="small"
                                        onClick={() => handleEditClick(index)}
                                    ><EditIcon color='success' /></Button>
                                    <Button size="small"
                                        onClick={() => handleDeleteStudent(index)}
                                    ><DeleteIcon color='warning'/></Button>
                                </CardActions>
                            </Card>
                        ))
                        }

                    </Box>

                </TableContainer>
            </Box>

            {/* add student */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogContent  >

                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        required
                        fullWidth
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="text"
                        required
                        fullWidth
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="dense"
                        name="standard"
                        label="Standard"
                        type="text"
                        required='Standard is required'
                        fullWidth
                        value={profile.standard}
                        onChange={(e) => setProfile({ ...profile, standard: e.target.value })}
                        error={!!errors.standard}
                        helperText={errors.standard}
                    />
                    <TextField
                        margin="dense"
                        name="dob"
                        type="date"
                        fullWidth
                        required='DOB is required'
                        value={profile.dob}
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                        error={!!errors.dob}
                        helperText={errors.dob}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        required='Phone is required'
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                          error={!!errors.phone}
                          helperText={errors.phone}
                          />

                    {/* Profile Image Upload */}
                    <Button variant="contained" component="label">
                        Upload Profile Image
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                    {profileImage && (
                        <ProfileAvatar src={profileImage} alt="Profile Image" />
                    )}

                    {/* Add Skills */}
                    <TextField
                        margin="dense"
                        label="Skill"
                        type="text"
                        fullWidth
                        onBlur={(e) => handleAddSkill(e.target.value, 'Beginner')} // Add skill with default proficiency
                    />

                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleAddStudent(profile)}
                        color="primary" variant="contained">
                        Add Student
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Student Dialog */}
            <Dialog open={editOpen} onClose={handleClose}>
                <DialogTitle>Edit Student</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="text"
                        fullWidth
                        required
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="dense"
                        name="standard"
                        label="Standard"
                        type="text"
                        required
                        fullWidth
                        value={profile.standard}
                        onChange={(e) => setProfile({ ...profile, standard: e.target.value })}
                        error={!!errors.standard}
                        helperText={errors.standard}
                    />
                    <TextField
                        margin="dense"
                        name="dob"
                        type="date"
                        fullWidth
                        required
                        value={profile.dob}
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                        error={!!errors.dob}
                        helperText={errors.dob}

                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        required
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                    {/* Profile Image Update */}
                    <Button variant="contained" component="label">
                        Change Profile Image
                        <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                    </Button>
                    {profileImage && (
                        <ProfileAvatar src={profileImage} alt="Profile Image" />
                    )}


                    {/* Skills */}
                    <Typography variant="h6">Skills</Typography>
                    {profile.skills.map((skill, index) => (
                        <Box key={index} display="flex" alignItems="center">
                            <Checkbox
                                checked={selectedSkills.includes(skill.name)}
                                onChange={() => handleSkillSelection(skill.name)}
                            />
                            <Typography variant="body2">{skill.name} ({skill.proficiency})</Typography>
                        </Box>
                    ))}
                    <Button onClick={toggleSelectAll}>Select All</Button>
                    <Button onClick={handleDeleteSkills}>Delete Selected Skills</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleEditStudent} color="primary" variant="contained">Update Student</Button>
                </DialogActions>
            </Dialog>



        </div>
    )
}

export default StudentCards



