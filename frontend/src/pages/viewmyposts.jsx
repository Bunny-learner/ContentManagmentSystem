import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/posts.css';
import Image from '@tiptap/extension-image'
import Loader from '../components/loader.jsx';
import ReadOnlyEditor from './readonlyeditor.jsx';
import '../css/tiptap.css'
import Noresultsfound from '../components/noresultsfound.jsx';

export default function Viewmyposts() {
  const [postname,setPostname]=useState('Published Posts')
  const [poststatus,setPoststatus]=useState('approved')
  const navigate = useNavigate();
  useEffect(() => {
    const username =window.location.href.split('/').pop();
    fetch('/getreqposts', {
      method: 'POST',
      credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: poststatus ,username:username})
    })
      .then(response => response.json())

      .then(data => {
        setPost(data.data);
        setTimeout(()=>{setLoading(false);}, 1000);
       
        if(poststatus==='approved') {
          setPostname('Published Posts')
        }
        else{
          setPostname('Draft Posts')
        }
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, [poststatus]);

const gotopost = (e) => {
   const title = e.currentTarget.querySelector('h1').textContent;
  if(postname!=='Draft Posts') {
    const username = e.currentTarget.querySelector('.username').textContent.split(':')[1].trim();
    navigate(`/home/viewpost?user=${username}&title=${title}` );
  }
  else{
    const formatted=e.currentTarget.querySelector('.time').textContent.trim();
    console.log('formatted',formatted);
    const reversed = new Date(formatted.replace(' ', 'T')); 
    console.log(reversed)
    const timeParam = encodeURIComponent(reversed.toISOString());
    navigate(`/home/createpost?status=draft&time=${timeParam}&title=${title}`);
  }}

  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(true);

  const gettime=(temp)=>{

   const format=new Date(temp).toISOString().replace('T', ' ').slice(0, 19);
   return format;
  }

  function setthestatus(e) {
    const text=e.target.textContent.toLowerCase().trim();
    if(poststatus==='approved' && text==='published') {
      return;
    }
    if(poststatus==='draft' && text==='drafts') return;
    setPoststatus(text==='published' ? 'approved' : 'draft');
    setLoading(true);
  }
  return (
    <div className="any" style={{marginTop:'120px'}}>
      <div className="allposts">
        <header>
          <h1 id='postname'>{postname}</h1>
          <span>
            <button onClick={setthestatus}>Published </button>
            <button onClick={setthestatus}>Drafts</button>
          </span>
        </header>
        <main className='required posts'>
          {!loading ? (
            <>
              {post.length > 0 ? (post.map((item, index) => (
                <div className='post' onClick={gotopost} key={index}>
                  <h1 className='title'>{item.title}</h1>
                  <div className='postcontent'>
                    <img 
                      className="defaultimg" src={item.urls.length==0 ? "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png/500px-Mars_-_August_30_2021_-_Flickr_-_Kevin_M._Gill.png":item.urls[0] }
                      alt="Post visual"
                    />
                      <p>{item.description.slice(0,200)}
                        <span><p className='username'>posted By: {item.username}</p>
                  <p>Posted on:<em className='time'> {gettime(item.createdAt)}</em></p></span>
                        
                      </p>
                      
                  </div>

                  
                </div>

              ))) : <Noresultsfound/>}
            </>
          ) : (
            <Loader />
          )}
        </main>

        <footer></footer>
        </div>
      </div>

  )
}
