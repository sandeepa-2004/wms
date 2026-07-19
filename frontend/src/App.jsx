import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080/api';

// Helper component for private routes
const PrivateRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/resident'} replace />;
  }
  return children;
};

// Navigation Bar Component
const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="nav-brand-icon">♻️</span> EcoWMS
      </Link>
      {user && (
        <div className="nav-links">
          <span className={`user-badge ${user.role.toLowerCase()}`}>
            {user.role === 'ADMIN' ? '🛡️ Admin' : '🏡 Resident'}: {user.username}
          </span>
          <button onClick={() => { onLogout(); navigate('/login'); }} className="logout-btn">
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

// Login Page Component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Invalid username or password');
      }

      const data = await response.json();
      onLogin(data);
      setSuccess('Logged in successfully! Redirecting...');
      setTimeout(() => {
        if (data.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/resident');
        }
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">♻️</div>
          <h2 className="auth-title"> Eco 
            Waste Management System</h2>
          <p className="auth-subtitle">Sign in to manage waste collection and disposal</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              placeholder="e.g. kamal_silva"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Sign In</button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Register here</Link>
        </div>
      </div>
    </div>
  );
};

// Register Page Component
const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('RESIDENT');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, role, phone, address })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Registration failed');
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">♻️</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join EcoWMS for a cleaner community</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              className="form-control"
              placeholder="e.g. alex_green"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              className="form-control"
              placeholder="alex@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-role">Role</label>
            <select
              id="reg-role"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="RESIDENT">Resident / Household</option>
              
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="reg-phone">Phone Number</label>
            <input
              id="reg-phone"
              type="tel"
              className="form-control"
              placeholder="555-019-2834"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reg-address">Address</label>
            <input
              id="reg-address"
              type="text"
              className="form-control"
              placeholder="123 Eco Blvd, Green Town"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

// Resident Dashboard Component
const ResidentDashboard = ({ user }) => {
  const [bins, setBins] = useState([]);
  const [requests, setRequests] = useState([]);
  const [wasteType, setWasteType] = useState('ORGANIC');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Fetch Bins and Requests
  const fetchData = async () => {
    try {
      const binsRes = await fetch(`${API_BASE_URL}/bins`);
      if (binsRes.ok) {
        const binsData = await binsRes.json();
        setBins(binsData);
      }
      
      const reqRes = await fetch(`${API_BASE_URL}/requests/resident/${user.id}`);
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if(description == '' ){
      alert("please fill it,unless we can not find your bin")
      
    }
    setFormError('');
    setFormSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          residentId: user.id,
          wasteType,
          quantity: parseFloat(quantity),
          description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit pickup request');
      }

      setFormSuccess('Disposal request submitted successfully!');
      setQuantity('');
      setDescription('');
      fetchData(); // Refresh requests list
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' })
      });
      if (response.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-content">
      <div className="welcome-hero">
        <div className="welcome-hero-content">
          <h1>Welcome Home, {user.username}!</h1>
          <p>Request disposals, track local bins, and monitor collection statuses.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Request pickup Form */}
        <div className="card">
          <h3 className="card-title">Schedule Waste Pick-up 📦</h3>
          {formError && <div className="alert alert-danger">{formError}</div>}
          {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
          <form onSubmit={handleCreateRequest}>
            <div className="form-group">
              <label htmlFor="wasteType">Waste Type</label>
              <select
                id="wasteType"
                className="form-control"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
              >
                <option value="ORGANIC">Organic (Food / Green)</option>
                <option value="RECYCLABLE">Recyclable (Paper / Plastic)</option>
                <option value="HAZARDOUS">Hazardous (E-waste / Chemical)</option>
                <option value="GENERAL">General Landfill</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Estimated Weight (kg)</label>
              <input
                id="quantity"
                type="number"
                step="0.1"
                className="form-control"
                placeholder="e.g. 5.5"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="desc">Notes / Location Details</label>
              <textarea
                id="desc"
                className="form-control"
                placeholder="e.g.122  colombo 7"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Submit Pickup Request</button>
          </form>
        </div>

        {/* Local Smart Bins list */}
        <div className="card">
          <h3 className="card-title">Neighborhood Smart Bins 📡</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', maxHeight: '350px', paddingRight: '0.25rem' }}>
            {bins.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No smart bins configured.</p>
            ) : (
              bins.map(bin => {
                const fillPercentage = ((bin.currentLevel / bin.capacity) * 100).toFixed(0);
                const statusClass = bin.status.toLowerCase();
                return (
                  <div key={bin.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 600 }}>{bin.location}</span>
                      <span className={`badge-status ${statusClass}`}>{bin.status}</span>
                    </div>
                    <div className="bin-gauge">
                      <div
                        className={`bin-gauge-fill ${statusClass}`}
                        style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                      ></div>
                    </div>
                    <div className="bin-meta">
                      <span className="badge-type">{bin.type}</span>
                      <span>{fillPercentage}% Full ({bin.currentLevel} / {bin.capacity} kg)</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Requests History */}
      <div className="card" style={{ width: '100%' }}>
        <h3 className="card-title">Your Collection Requests 📅</h3>
        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1.5rem 0' }}>No requests submitted yet.</p>
        ) : (
          <div className="table-container">
            <table className="wms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Waste Type</th>
                  <th>Quantity</th>
                  <th>Request Date</th>
                  <th>Scheduled For</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>#{req.id}</td>
                    <td><span className="badge-type">{req.wasteType}</span></td>
                    <td>{req.quantity} kg</td>
                    <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td>{req.scheduledDate ? new Date(req.scheduledDate).toLocaleString() : 'Not Scheduled'}</td>
                    <td>
                      <span className={`badge-req ${req.status.toLowerCase()}`}>{req.status}</span>
                    </td>
                    <td>
                      {req.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancelRequest(req.id)}
                          className="logout-btn"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const [bins, setBins] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Forms states
  const [newBinLocation, setNewBinLocation] = useState('');
  const [newBinCapacity, setNewBinCapacity] = useState('');
  const [newBinType, setNewBinType] = useState('ORGANIC');

  const [selectedBinId, setSelectedBinId] = useState('');
  const [updateLevel, setUpdateLevel] = useState('');

  const [activeRequestForScheduling, setActiveRequestForScheduling] = useState(null);
  const [scheduleDateInput, setScheduleDateInput] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchData = async () => {
    try {
      const binsRes = await fetch(`${API_BASE_URL}/bins`);
      if (binsRes.ok) setBins(await binsRes.json());

      const requestsRes = await fetch(`${API_BASE_URL}/requests`);
      if (requestsRes.ok) setRequests(await requestsRes.json());

      const usersRes = await fetch(`${API_BASE_URL}/users`);
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddBin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/bins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: newBinLocation,
          capacity: parseFloat(newBinCapacity),
          currentLevel: 0.0,
          type: newBinType,
          status: 'EMPTY'
        })
      });

      if (!response.ok) throw new Error('Failed to create bin');

      setSuccessMsg('New smart bin added successfully!');
      setNewBinLocation('');
      setNewBinCapacity('');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleUpdateBinLevel = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedBinId) {
      setErrorMsg('Please select a bin to update');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/bins/${selectedBinId}/level`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentLevel: parseFloat(updateLevel) })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to update level');
      }

      setSuccessMsg('Bin level updated successfully!');
      setUpdateLevel('');
      fetchData();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteBin = async (binId) => {
    if (!window.confirm("Are you sure you want to delete this bin?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/bins/${binId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setSuccessMsg('Bin deleted successfully');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenScheduleModal = (req) => {
    setActiveRequestForScheduling(req);
    // Preset current date
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setScheduleDateInput(now.toISOString().slice(0, 16));
  };

  const handleScheduleCollectionSubmit = async (e) => {
    e.preventDefault();
    if (!activeRequestForScheduling) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${activeRequestForScheduling.id}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledDate: new Date(scheduleDateInput).toISOString() })
      });

      if (response.ok) {
        setSuccessMsg(`Scheduled pickup for request #${activeRequestForScheduling.id}`);
        setActiveRequestForScheduling(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteCollection = async (requestId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/requests/${requestId}/complete`, {
        method: 'PUT'
      });
      if (response.ok) {
        setSuccessMsg(`Collection #${requestId} marked completed!`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const totalWeightRequested = requests
    .filter(r => r.status === 'COMPLETED')
    .reduce((sum, r) => sum + r.quantity, 0);

  const fullBinsCount = bins.filter(b => b.status === 'FULL').length;
  const pendingRequestsCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="main-content">
      <div className="welcome-hero">
        <div className="welcome-hero-content">
          <h1>EcoWMS Administrator Hub 🛡️</h1>
          <p>Configure smart sensors, schedule local truck dispatches, and oversee waste statistics.</p>
        </div>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {/* Quick stats dashboard */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon emerald">📊</div>
          <div className="stat-info">
            <h4>Total Bins</h4>
            <p>{bins.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rose">🚨</div>
          <div className="stat-info">
            <h4>Full Bins</h4>
            <p>{fullBinsCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">⏳</div>
          <div className="stat-info">
            <h4>Pending Pickups</h4>
            <p>{pendingRequestsCount}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon cyan">🚛</div>
          <div className="stat-info">
            <h4>Total Recycled</h4>
            <p>{totalWeightRequested.toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Manage Bins card */}
        <div className="card">
          <h3 className="card-title">Add Smart Sensor Bin 🛰️</h3>
          <form onSubmit={handleAddBin}>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Westside Avenue"
                value={newBinLocation}
                onChange={(e) => setNewBinLocation(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Capacity (kg)</label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 100"
                value={newBinCapacity}
                onChange={(e) => setNewBinCapacity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Waste Type</label>
              <select
                className="form-control"
                value={newBinType}
                onChange={(e) => setNewBinType(e.target.value)}
              >
                <option value="ORGANIC">Organic</option>
                <option value="RECYCLABLE">Recyclable</option>
                <option value="HAZARDOUS">Hazardous</option>
                <option value="GENERAL">General</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Register Bin</button>
          </form>
        </div>

        {/* Update fill levels card */}
        <div className="card">
          <h3 className="card-title">Update Sensor Telemetry 📶</h3>
          <form onSubmit={handleUpdateBinLevel}>
            <div className="form-group">
              <label>Select Target Bin</label>
              <select
                className="form-control"
                value={selectedBinId}
                onChange={(e) => setSelectedBinId(e.target.value)}
              >
                <option value="">-- Choose Bin --</option>
                {bins.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.location} ({b.type}) - Max: {b.capacity} kg
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Current Sensor Reading (kg)</label>
              <input
                type="number"
                step="0.1"
                className="form-control"
                placeholder="Enter current weight in bin"
                value={updateLevel}
                onChange={(e) => setUpdateLevel(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary btn-block">Simulate Level Update</button>
          </form>
        </div>
      </div>

      {/* Smart Bins Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Smart Waste Bins Directory 📡</h3>
        {bins.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No Bins registered yet.</p>
        ) : (
          <div className="table-container">
            <table className="wms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Telemetry Level</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bins.map(bin => {
                  const fillPercentage = ((bin.currentLevel / bin.capacity) * 100).toFixed(0);
                  return (
                    <tr key={bin.id}>
                      <td>#{bin.id}</td>
                      <td>{bin.location}</td>
                      <td><span className="badge-type">{bin.type}</span></td>
                      <td>{bin.currentLevel} / {bin.capacity} kg ({fillPercentage}%)</td>
                      <td>
                        <span className={`badge-status ${bin.status.toLowerCase()}`}>{bin.status}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteBin(bin.id)}
                          className="logout-btn"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collection Queue */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 className="card-title">Residential Pick-up Request Queue ⏳</h3>
        {requests.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Queue is currently empty.</p>
        ) : (
          <div className="table-container">
            <table className="wms-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Resident</th>
                  <th>Type</th>
                  <th>Weight</th>
                  <th>Request Date</th>
                  <th>Scheduled Date</th>
                  <th>Status</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td>#{req.id}</td>
                    <td>{req.residentUsername} (ID: {req.residentId})</td>
                    <td><span className="badge-type">{req.wasteType}</span></td>
                    <td>{req.quantity} kg</td>
                    <td>{new Date(req.requestDate).toLocaleDateString()}</td>
                    <td>{req.scheduledDate ? new Date(req.scheduledDate).toLocaleString() : 'Unscheduled'}</td>
                    <td>
                      <span className={`badge-req ${req.status.toLowerCase()}`}>{req.status}</span>
                    </td>
                    <td>
                      {req.status === 'PENDING' && (
                        <button
                          onClick={() => handleOpenScheduleModal(req)}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
                        >
                          Schedule Truck
                        </button>
                      )}
                      {req.status === 'SCHEDULED' && (
                        <button
                          onClick={() => handleCompleteCollection(req.id)}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem', color: '#fff' }}
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users List */}
      <div className="card">
        <h3 className="card-title">Registered Accounts Directory 👥</h3>
        <div className="table-container">
          <table className="wms-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td style={{ fontWeight: 600 }}>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    <span className={`user-badge ${u.role.toLowerCase()}`} style={{ display: 'inline-block' }}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.address || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {activeRequestForScheduling && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ margin: 0 }}>Schedule Truck Dispatch 🚛</h3>
              <button className="modal-close" onClick={() => setActiveRequestForScheduling(null)}>×</button>
            </div>
            <form onSubmit={handleScheduleCollectionSubmit}>
              <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Scheduling pick-up for <strong>{activeRequestForScheduling.residentUsername}</strong>'s request
                ({activeRequestForScheduling.quantity} kg of {activeRequestForScheduling.wasteType}).
              </p>
              <div className="form-group">
                <label>Dispatch Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-control"
                  value={scheduleDateInput}
                  onChange={(e) => setScheduleDateInput(e.target.value)}
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveRequestForScheduling(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Root App Component
function App() {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('currentUser')) || null
  );

  const handleLogin = (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navigation user={currentUser} onLogout={handleLogout} />
        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to={currentUser.role === 'ADMIN' ? '/admin' : '/resident'} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              currentUser ? (
                <Navigate to={currentUser.role === 'ADMIN' ? '/admin' : '/resident'} replace />
              ) : (
                <Register />
              )
            }
          />
          <Route
            path="/resident"
            element={
              <PrivateRoute allowedRole="RESIDENT">
                <ResidentDashboard user={currentUser} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRole="ADMIN">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              currentUser ? (
                <Navigate to={currentUser.role === 'ADMIN' ? '/admin' : '/resident'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
