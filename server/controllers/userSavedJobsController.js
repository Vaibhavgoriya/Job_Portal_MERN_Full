import User from '../models/User.js';
import Job from '../models/Job.js';

// Get all saved jobs for the logged-in user
export const getSavedJobs = async (req, res) => {
  try {
    console.log('getSavedJobs called, user id:', req.user?.id);
    const user = await User.findById(req.user.id).populate('savedJobs');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Saved jobs:', user.savedJobs);
    res.json(user.savedJobs || []);
  } catch (err) {
    console.error('getSavedJobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save or unsave a job for the user
export const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const jobId = req.body.jobId;
    if (!jobId) return res.status(400).json({ message: 'Job ID required' });
    const idx = user.savedJobs.findIndex(j => j.toString() === jobId);
    let action;
    if (idx === -1) {
      user.savedJobs.push(jobId);
      action = 'saved';
    } else {
      user.savedJobs.splice(idx, 1);
      action = 'unsaved';
    }
    await user.save();
    res.json({ status: action, savedJobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
