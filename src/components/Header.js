import React, {useEffect} from 'react';
import { auth } from '../utils/firebase';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from '../utils/userSlice';
import { toggleGptSearchView } from '../utils/gptSlice';
import { SUPPORTED_LANGUAGES } from '../utils/constants';
import { changeLanguage } from '../utils/configSlice';

const Header = () => {

  const showGptSearch = useSelector((store) => store.gpt.showGptSearch);
  const user = useSelector((store) => store.user);

  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const{ uid, email, displayName} = user;
        dispatch(addUser({uid: uid, email: email, displayName: displayName}));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });

    return () => unsubscribe();
  },[])

  const navigate = useNavigate();
  

  const handleSignOut = () => {
    signOut(auth).then(() => {
    }).catch((error) => {
      navigate("/error");
    });
  }

  const handleGptSearchClick = () => {
    dispatch(toggleGptSearchView());
  }
  
  const handleLanguageChange = (e) => {
    dispatch(changeLanguage(e.target.value));
  }

  return (
    <div className=' absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row justify-between'>
      <img className='w-44 mx-auto md:mx-0' src={require('../assets/logo.png')} alt="logo" />
      {
        user && <div className='flex p-2'>
        {showGptSearch && <select className='bg-gray-900 rounded-lg mx-2 text-white' onChange={handleLanguageChange}>
          {SUPPORTED_LANGUAGES.map(lang => <option key={lang.identifier} value={lang.identifier}>{lang.name}</option>)}
        </select>}
        <button className='bg-purple-800 p-2 text-white rounded-lg mx-4' onClick = {handleGptSearchClick}>{showGptSearch ? "HomePage" : "GPT Search"}</button>
          <img className='w-12 h-9' alt="userIcon" src={require('../assets/user.png')} />
          <button className="font-bold text-white" onClick={handleSignOut}>Sign Out</button>
        </div>
      }
    </div>
  )
}

export default Header;