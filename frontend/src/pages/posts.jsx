import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Image from '@tiptap/extension-image'
import Loader from '../components/loader.jsx';
import ReadOnlyEditor from './readonlyeditor.jsx';
import '../css/posts.css';
import { FaPenFancy, FaSearch } from 'react-icons/fa';
import '../css/tiptap.css'
import Noresultsfound from '../components/noresultsfound.jsx';
import Loading from '../components/loading.jsx';
import si from '../assets/search.png'
import Loadingskeleton from '../components/loadingskeleton.js';

export default function Posts() {
  const [searchvalue, setSearchvalue] = useState('');
  const [user,setUser] = useState('');
   const [post, setPost] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/allposts', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())

      .then(data => {
        setPost(data.data);
          console.log(typeof(data.data))
        setUser(data.username);
        console.log(user)
      setTimeout(() => {
          setLoading(false);
        }, 1000); 
      
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);
 
  const navigate = useNavigate();
  const createpost = () => {
    navigate('/home/createpost');
  }
  const viewposts = () => {
    console.log(user)
    navigate(`/home/${user}`);
    
  }

  const gotopost = (e) => {
    const username = e.currentTarget.querySelector('.username').textContent.split(':')[1].trim();
    const title = e.currentTarget.querySelector('h1').textContent;
    navigate(`/home/viewpost?user=${username}&title=${title}` );
  }

  const results = (e) => {

    if(searchvalue.trim() !== '') {
      setLoading(true);
    fetch(`/searchresults?query=${searchvalue}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setPost(data.data);
        setLoading(false);})
      .catch(error => {
        console.error('Error fetching search results:', error);
      });
  }}
  const look=(e)=>{
    setSearchvalue(e.target.value)
  }
  return (
    <div className="any">
      <div className="allposts">
        <header>
          <span className='searching'><input type="text" id='search' value={searchvalue} onChange={look}  placeholder="Search posts..." />
          <button id='searchimg' onClick={results}><FaSearch size={24} color="#007bff"/></button></span>
          
          <span className='typeposts'>
            <button onClick={createpost}> <FaPenFancy size={22} /> Create</button>
            <button onClick={viewposts}> My Posts</button>
          </span>
        </header>
        <main>
          {!loading ? (
 Array.isArray(post) && post.length>0? (
    <>
      {post.map((item, index) => (
        <div className='post' onClick={gotopost} key={index}>
          <h1 className='title'>{item.title}</h1>
          <div className='postcontent'>
            <img
              className="defaultimg"
              src={
                item.urls.length === 0
                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png/500px-Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png"
                  : item.urls[0]
              }
              alt="Post visual"
            />
            <p>
              {item.description.slice(0, 200)}
              <span>
                <p className='username'>Posted By: {item.username}</p>
                <p><em>Posted on:</em> {new Date(item.createdAt).toLocaleDateString()}</p>
              </span>
            </p>
          </div>
        </div>
      ))}
    </>
  ) : (
    <Noresultsfound/>
  )
) : (
  <Loader/>
)}

        </main>

        <footer></footer>
      </div>
    </div>

  )
}
