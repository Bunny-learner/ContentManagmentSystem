
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { FaBold, FaItalic, FaStrikethrough, FaHeading, FaListUl, FaListOl, FaCode, FaImage, FaQuoteRight, FaHighlighter, FaAlignLeft, FaAlignCenter, FaAlignRight, FaAlignJustify, FaUndo, FaRedo, FaSave, FaPaperPlane } from 'react-icons/fa'
import TextAlign from '@tiptap/extension-text-align'
import React, { useState, useEffect } from 'react'
import Highlight from '@tiptap/extension-highlight'
import Dropcursor from '@tiptap/extension-dropcursor'
import { ResizableImage } from 'tiptap-extension-resizable-image'
import 'tiptap-extension-resizable-image/styles.css'
import '../css/tiptap.css'
import { useNavigate } from 'react-router-dom'
import { useSocket} from '../SocketContext'



const Tiptap = (props) => {
  const [content, setContent] = useState(null)
  const [prevtitle,setprevtitle]=useState("")
  const navigate = useNavigate()
 const {socket}=useSocket()
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage.configure({
        defaultWidth: 600,
        defaultHeight: 400,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Dropcursor,
      Highlight],
    content: `<p>Start writing your post here...</p>
    <p>Publishing the post needs approval of the editor.</p>`, 
  })

useEffect(() => {
  if (editor && content) {
    console.log('Setting JSON content into editor:', content);
    editor.commands.setContent(content);
  }
}, [editor, content]);


let time;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setprevtitle(params.get('title'))
    const fetchthedraft = async (time) => {
      console.log('fetching the draft post')
      await fetch('/getdraftpost', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time: time}),
      })
        .then(response => response.json())
        .then(data => {
if (data.data?.content) {
  if (typeof data.data.content === 'string') {
    setContent(JSON.parse(data.data.content));//content need to be parsed as object if it's a string
  } else {
    setContent(data.data.content);
  }
}

        })
        .catch(err => console.log(err));
    }
    if (params.get('time')) {
      console.log('params', params.get('time'));
       time = new Date(params.get('time'));

// add 5 hours 30 minutes (5 * 60 + 30 = 330 minutes)
time = new Date(time.getTime() +330 * 60 * 1000);

time = time.toISOString();

console.log('time', time);
      fetchthedraft(time);
    }
  }, [])

useEffect(() => {console.log(props)}, [props.userrole, props.name])

  const json = editor.getJSON()

  const publish = async (e) => {
    let status = e.currentTarget.className.includes('publish') ? 'pending' : 'draft';
    let title = "";
    let description = "";
    console.log(status)
    console.log(props.userrole,props.name)
    if (status === 'pending'){
      title = window.prompt('Enter the title of your post')
       if (!title) {
        alert('Title is required to publish the post')
        return;
      }
      description = window.prompt('Enter the description of your post')
      if (!description) {
        alert('Description is required to publish the post!')
        return;
      }


      if(props.userrole?.toLowerCase().trim()=='editor')
      status='approved'
    }

    else {

      title = window.prompt('Title is required for draft post')
      if(title==""){
      alert('save with a temporary title.')
      return;
    }
      description = 'This is a draft post'
    }

    

    let user=""
    const urls = await geturls();
    if (urls) {
      console.log(status)
      fetch('/addpost', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          description: description,
          urls: urls,
          content: json,
          status:status,
          prevtitle:!prevtitle?"":prevtitle
        }),
      })
        .then(response => {
          return response.json()
        })
        .then(data=>{
          console.log(data.message)
        })
        .catch(error => { console.log(error) })}

      if(status=='pending'){
      console.log('Request for publishing post',props.name,props.userrole)

      socket.emit('requestforpublishing', {
        title:title,
        description:description,
        role:props.userrole,
        content:json,
        username:props.name,
        image:urls[0],
      })
      alert('Request for Publishing has been sent.')
      navigate('/notifications')
    }

      else if(status=='approved'){
        alert('Post has been published successfully.')
        navigate(`/home/${user}`)
      }
      else{
        alert('Draft has been saved in myposts.')
        navigate(`/home/${user}`)
      }
    }

  


  const geturls = async () => {
    console.log("urls posting to the cloudinaryserver")
    const urls = [];
    console.log(json)
    json.content.forEach((item) => {
      if (Array.isArray(item.content)) {
        item.content.forEach((subItem) => {
          if (subItem.type === 'imageComponent' && subItem.attrs?.src) {
            urls.push(subItem.attrs.src);
          }
        });
      }
    });

    return urls;
  }
  const addImage = () => {
    const url = window.prompt('URL')

    if (url) {
      editor.chain().focus().setResizableImage({
        src: url,
        alt: '',
        width: 200,
        height: 200,
        'data-keep-ratio': true,
      }).run();
    }
  }
  if (!editor) {
    return null
  }

  return (
    <div className="main">
      <div className="any" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '120px' }}>
        <div className="button-group">
       <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
  <FaBold />
</button>

<button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
  <FaItalic />
</button>

<button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
  <FaStrikethrough />
</button>

<button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
  <FaHeading />
</button>

<button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
  <FaListUl />
</button>

<button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
  <FaListOl />
</button>

<button onClick={addImage}>
  <FaImage />
</button>

<button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
  <FaQuoteRight />
</button>

<button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
  <FaHighlighter />
</button>

<button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
  <FaAlignLeft />
</button>

<button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
  <FaAlignCenter />
</button>

<button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
  <FaAlignRight />
</button>

<button onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
  <FaAlignJustify />
</button>

<button onClick={() => editor.chain().focus().undo().run()}>
  <FaUndo />
</button>

<button onClick={() => editor.chain().focus().redo().run()}>
  <FaRedo />
</button>

<button className="publish" onClick={publish}>
  <FaPaperPlane /> {/* or use a paper plane or rocket icon for publish */}
</button>

<button className="save" onClick={publish}>
  <FaSave />
</button>

        </div>

        <div className="editor">
          <EditorContent editor={editor} />
        </div>

      </div>

    </div>
  )
}

export default Tiptap
