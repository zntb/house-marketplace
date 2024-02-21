import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config.js';
import { toast } from 'react-toastify';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setFormData({
          name: user.displayName || '',
          email: user.email || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onLogout = () => {
    const auth = getAuth();
    auth.signOut();
    navigate('/');
  };

  const onSubmit = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return; // Ensure user is available

      if (formData.name !== user.displayName) {
        await updateProfile(user, {
          displayName: formData.name,
        });

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: formData.name,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Could not update profile details');
    }
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  if (loading) return <p>Loading...</p>;

  if (!user) {
    // Redirect to login page if user is not authenticated
    navigate('/login');
    return null;
  }

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p
            className="changePersonalDetails"
            onClick={() => {
              setChangeDetails((prevState) => !prevState);
              onSubmit();
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!changeDetails ? 'profileName' : 'profileNameActive'}
              disabled={!changeDetails}
              value={formData.name}
              onChange={onChange}
            />
            <input
              type="email"
              id="email"
              className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
              disabled={!changeDetails}
              value={formData.email}
              onChange={onChange}
            />
          </form>
        </div>
      </main>
    </div>
  );
}

export default Profile;
