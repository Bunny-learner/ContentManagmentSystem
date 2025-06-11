import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import '../css/posts.css';
import Image from '@tiptap/extension-image'
import Loader from '../components/loader.jsx';
import ReadOnlyEditor from './readonlyeditor.jsx';
export default function Viewpost(props) {
  const params = new URLSearchParams(window.location.search);
  useEffect(() => {
   
    fetch('/postview', {
      method: 'POST',
      credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: params.get('user'),
            title: params.get('title')
        })
    })
      .then(response => response.json())

      .then(data => {
        setPost(data.data);
        setTimeout(() => {
          setLoading(false);
        }, 2000); 
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      });
  }, []);

  const [post, setPost] = useState([])
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  return (

    <div className="any" style={{display: 'flex', flexDirection: 'column', alignItems: 'center',marginTop: '120px'}}>
      <div className="allposts" id="allposts" >
        <main className='viewpost'>
          {!loading ? (
            <>
              {post?
               (<ReadOnlyEditor 
          content={post.content}
          title={post.title}
          date={post.createdAt}
          author={post.username}
          role={props.userrole}
          editorname={props.name}
          desc={post.description}
          className="posty"
          notif={params.get('inNotif')?params.get('inNotif'):false}
          style={{ marginBottom: '20px' }}
        />):(
                <div className='posty'>
                  <h1>No post found</h1>
                  <p>It seems like the post you are looking for does not exist.</p>
                </div>)}
              
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
