// ReadOnlyEditor.jsx
import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; // <--- Make sure this is imported and used
import { ResizableImage } from 'tiptap-extension-resizable-image';
import '../css/navbar.css'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSocket } from "../SocketContext.js";

const ReadOnlyEditor = ({ content, title, desc,date, author, editorname,className, style,notif,role }) => {
const navigate=useNavigate()
const {socket}=useSocket()

const decision= async (e) => {
  let status='';
  let text=e.target.textContent
  const result = await Swal.fire({
    title: 'Are you sure?',
    text:text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#28a745',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Approve',
    cancelButtonText: 'Cancel',
  });

  if (result.isConfirmed) {
    Swal.fire(`${text}! `, `The item has been ${text}`, 'success');
  if(text.toLowerCase()=='reject')
  status=text.toLowerCase().trim()+'ed'
  else
  status=text.toLowerCase().trim()+'d'
console.log(status)
const msg=document.getElementById('optional').value.trim()

await fetch('/addingnotif',{
  method:'POST',
  credentials:'include',
  headers:{
    'Content-Type':'application/json'
  },body:JSON.stringify({
    name:editorname,
    title:title,
    desc:desc,
    author:author,
    msg:msg,
    status:status,
  })
})
.then(response=>{return response.json()})
.then(data=>{
if(data.message=='success'){
socket.emit('responsepost',{
status:status,
msg:msg,
from:"editor",
editorname:editorname,
title:title,
author:author,
content:content,
desc:desc
})
 navigate('/notifications')
}})
  }
}
  const editor = useEditor({
    editable: false,
    extensions: [StarterKit,
      ResizableImage
    ], // <--- Include Image extension here
    content: content,
  });

  if (!editor) return null; 

  return (<>
   <div className={className} style={style}>
      <h1>{title}</h1>
      <p><strong>posted By:</strong> {author}</p>
      <EditorContent editor={editor} />
      <p><em>Posted on:</em> {new Date(date).toLocaleDateString()}</p>
    </div>
    {notif && role.toLowerCase() === 'editor' && (
  <div className="bottom">
    <div className="group">
      <button id="approve" className="action-button" onClick={decision}>Approve</button>
      <button id="reject" className="action-button" onClick={decision}>Reject</button>
    </div>
    <textarea
      name="optional"
      required
      id="optional"
      placeholder="write some comment before reject or approval..."
    ></textarea>
  </div>
)}
</>
   
  );
};

export default ReadOnlyEditor