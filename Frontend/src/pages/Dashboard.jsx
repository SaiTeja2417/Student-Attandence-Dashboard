import { AppBar, Toolbar, Typography, Box, Button, Tabs, Tab, Card, CardContent, Grid, TextField, Chip, } from "@mui/material";
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SupervisedUserCircleSharpIcon from '@mui/icons-material/SupervisedUserCircleSharp';
import { Font20 } from '../components/StyledFonts';
import { LogoutSharp } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
    const [value, setValue] = useState('1');

    // students fetched from backend (master list)
    const [students, setStudents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

    // report + totals from backend
    const [reportData, setReportData] = useState([]); // per-student aggregated report
    const [totals, setTotals] = useState({ totalDaysRecorded: 0, totalStudents: 0, totalPresent: 0, totalAbsent: 0 });


    const loadReport = async () => {
        try {
            const res = await fetch('http://localhost:5000/attendance/report');
            if (!res.ok) return;
            const json = await res.json();
            setReportData(json.report || []);
            setTotals(json.totals || { totalDaysRecorded: 0, totalStudents: 0, totalPresent: 0, totalAbsent: 0 });
        } catch (err) { console.error(err); }
    };

    const handleChange = (e, v) => setValue(v);

    const toggleAttendance = (id) => {
        setStudents(prev => prev.map(s => s.id === id ? ({ ...s, status: s.status === 'Present' ? 'Absent' : 'Present' }) : s));
    };

    const markAllPresent = () => {
        setStudents(prev => prev.map(s => ({ ...s, status: 'Present' })));
    };

    const saveAttendance = async () => {
        // build payload with normalized statuses
        const payload = {
            date: selectedDate,
            students: students.map(s => ({ id: s.id, status: s.status }))
        };

        try {
            const res = await fetch('http://localhost:5000/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                await loadReport();
                alert('Attendance saved');
                setValue('2'); // switch to reports
            } else {
                const err = await res.json();
                alert('Save failed: ' + (err.message || 'unknown'));
            }
        } catch (err) {
            console.error(err);
            alert('Network error saving attendance');
        }
    };
    
useEffect(() => {
    const initLoad = async () => {
        try {
            // Load students
            const r = await fetch('http://localhost:5000/students');
            const data = await r.json();
            const init = data.map(s => ({ ...s, status: "Present" }));
            setStudents(init);

            // Load report
            await loadReport(); 
        } catch (err) {
            console.error(err);
        }
    };

    initLoad();
}, []);


    const presentCount = students.filter(s => s.status === 'Present').length;
    const absentCount = students.filter(s => s.status === 'Absent').length;

    const pieData = [
        { name: 'Present', value: totals.totalPresent || presentCount },
        { name: 'Absent', value: totals.totalAbsent || absentCount }
    ];

    const barData = (reportData.length ? reportData : students.map(s => ({ id: s.id, name: s.name, present: s.status === 'Present' ? 1 : 0, absent: s.status === 'Absent' ? 1 : 0 })));

    const COLORS = ['#00C49F', '#FF4C4C'];
    return (
        <div>
            <header>
                <div className="d-flex justify-content-between bg-primary p-4">
                    <div className='d-flex gap-3 align-items-center'>
                        <SupervisedUserCircleSharpIcon sx={{ color: "white" }} fontSize='large' />
                        <Font20>Student Attendence Dashboard</Font20>
                    </div>
                    <Link to={'/'}>
                        <div className='d-flex gap-3 align-items-center' style={{ cursor: "pointer" }}>
                            <Font20>Logout</Font20>
                            <LogoutSharp sx={{ color: "white" }} />

                        </div>
                    </Link>

                </div>

            </header>


            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab sx={{ fontSize: "20px" }} label="Mark Attendence" value="1" />
                            <Tab sx={{ fontSize: "20px" }} label="View Reports" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Card sx={{ p: 2, mb: 3 }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, md: 3 }}>
                                        <Typography>Date</Typography>
                                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                                            style={{marginTop: 8, padding: 10, borderRadius: 8, border: '1px solid #ddd', width: '100%'}}/>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 9 }} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2}}>
                                        <Button
                                            variant="outlined"
                                            onClick={markAllPresent}
                                            sx={{ textTransform: "none", borderRadius: 2 }}
                                        >
                                            Mark All Present
                                        </Button>

                                        <Button variant="contained" onClick={saveAttendance} sx={{ textTransform: "none", borderRadius: 2, bgcolor: "#009944", ":hover": { bgcolor: "#007f36" }}}>
                                            Save Attendance
                                        </Button>
                                    </Grid>

                                </Grid>

                                <Box sx={{ mt: 4, p: 2, borderRadius: 2, border: '1px solid #d4e5ff', display: 'flex', gap: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip icon={<CheckCircleIcon sx={{ color: 'green' }} />} label={<strong>{presentCount}</strong>} sx={{ bgcolor: '#e6ffe6' }} />
                                        <Typography>Present</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip icon={<CancelIcon sx={{ color: 'red' }} />} label={<strong>{absentCount}</strong>} sx={{ bgcolor: '#ffe6e6' }} />
                                        <Typography>Absent</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        <Box>
                            <Typography variant="h6">Students</Typography>
                            <Typography variant="body2" color="textSecondary">Click a student to toggle attendance</Typography>
                            <Box sx={{ mt: 2 }}>
                                {students.map(s => (
                                    <Box key={s.id} onClick={() => toggleAttendance(s.id)} sx={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, mb: 2, borderRadius: 2,
                                        background: s.status === 'Present' ? '#f1fff3' : '#ffeaea',
                                        border: `1px solid ${s.status === 'Present' ? '#b4f7c1' : '#ffb3b3'}`, cursor: 'pointer'
                                    }}>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{
                                                width: 56, height: 56, borderRadius: '50%',
                                                bgcolor: s.status === 'Present' ? '#00c251' : '#ff4d4d',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
                                            }}>{s.roll}</Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                                                <Typography variant="body2">Roll No: {s.roll}</Typography>
                                            </Box>
                                        </Box>
                                        <Button variant="contained" color={s.status === 'Present' ? 'success' : 'error'} sx={{ borderRadius: 3 }}>
                                            {s.status}
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </TabPanel>

                    <TabPanel value="2">
                        <Box sx={{ width: "100%", display: "block" }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }} >
                                    <Card
                                        sx={{
                                            p: 3,
                                            height: "100%",
                                            borderRadius: 3,
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Overall Attendance
                                        </Typography>

                                        <Typography variant="h3" sx={{ mt: 1, fontWeight: 700, color: "#6a00ff" }}>
                                            {totals.totalStudents && totals.totalDaysRecorded
                                                ? `${Math.round((totals.totalPresent / (totals.totalStudents * totals.totalDaysRecorded)) * 100)}%`
                                                : ((presentCount + absentCount) === 0 ? '0%' : `${Math.round((presentCount / (presentCount + absentCount)) * 100)}%`)}
                                        </Typography>

                                        <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                                            {totals.totalPresent || presentCount} present out of {totals.totalStudents || students.length} total
                                        </Typography>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            height: "100%",
                                            borderRadius: 3,
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Total Students
                                        </Typography>

                                        <Typography variant="h3" sx={{ mt: 1, fontWeight: 700, color: "#007bff" }}>
                                            {totals.totalStudents || students.length}
                                        </Typography>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 4 }}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            height: "100%",
                                            borderRadius: 3,
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Days Recorded
                                        </Typography>

                                        <Typography variant="h3" sx={{ mt: 1, fontWeight: 700, color: "#ff6600" }}>
                                            {totals.totalDaysRecorded || 0}
                                        </Typography>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            height: 400,
                                            borderRadius: 3,
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Student-wise Attendance
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Number of present and absent days
                                        </Typography>

                                        <Box sx={{ height: 300, mt: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={barData}>
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="present" stackId="a" fill="#00C49F" />
                                                    <Bar dataKey="absent" stackId="a" fill="#FF4C4C" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            height: 400,
                                            borderRadius: 3,
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.10)"
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Overall Distribution
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total present vs absent
                                        </Typography>

                                        <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <ResponsiveContainer width="80%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={90}
                                                        label
                                                    >
                                                        <Cell fill="#00C49F" />
                                                        <Cell fill="#FF4C4C" />
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </Card>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                                        }}
                                    >
                                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                            Individual Student Report
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            Detailed attendance percentage for each student
                                        </Typography>

                                        <Box sx={{ mt: 2 }}>
                                            {(reportData.length ? reportData : students.map(s => ({
                                                id: s.id,
                                                roll: s.roll,
                                                name: s.name,
                                                present: s.status === "Present" ? 1 : 0,
                                                absent: s.status === "Absent" ? 1 : 0,
                                                days: 1
                                            }))).map((r) => {
                                                const days = r.days || (r.present + r.absent) || 1;
                                                const percent = Math.round((r.present / days) * 100);

                                                return (
                                                    <Box
                                                        key={r.id}
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            p: 2,
                                                            mb: 2,
                                                            borderRadius: 2,
                                                            border: "1px solid #e1e4f9",
                                                            backgroundColor: "#fafbff"
                                                        }}
                                                    >
                                                        {/* LEFT */}
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 56,
                                                                    height: 56,
                                                                    borderRadius: "50%",
                                                                    background:
                                                                        "linear-gradient(135deg, #5b8cff, #7b5bff)",
                                                                    color: "#fff",
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center",
                                                                    fontWeight: 700
                                                                }}
                                                            >
                                                                {r.roll}
                                                            </Box>
                                                            <Box>
                                                                <Typography sx={{ fontWeight: 600 }}>{r.name}</Typography>
                                                                <Typography variant="body2">Roll No: {r.roll}</Typography>
                                                            </Box>
                                                        </Box>

                                                        {/* RIGHT */}
                                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                            <Box sx={{ width: 240 }}>
                                                                <Box sx={{ height: 10, background: "#eee", borderRadius: 5 }}>
                                                                    <Box
                                                                        sx={{
                                                                            width: `${percent}%`,
                                                                            height: "100%",
                                                                            borderRadius: 5,
                                                                            background:
                                                                                percent >= 50 ? "#4caf50" : "#ff4c4c"
                                                                        }}
                                                                    />
                                                                </Box>
                                                                <Typography variant="caption">
                                                                    {r.present}/{days} days
                                                                </Typography>
                                                            </Box>

                                                            <Button
                                                                variant="contained"
                                                                sx={{
                                                                    borderRadius: 2,
                                                                    bgcolor: percent >= 50 ? "success.main" : "error.main"
                                                                }}
                                                            >
                                                                {percent}%
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </TabPanel>


                </TabContext>
            </Box>
        </div>
    )
}

export default Dashboard