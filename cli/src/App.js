import React, { useState } from 'react';
import './App.css';
import ImgCopy from './copy.png'
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shorturl, setShortUrl]  =useState('');

  const generateLink = async ()=>{
    const response = await axios.post('/link',{
      url,
      slug
    })
    
    setShortUrl (response?.data?.data?.shortUrl);
  }
  const copyShortUrl = () =>{
    navigator.clipboard.writeText(shorturl)
    alert('copy to clipboard');
  }
  return (
    <>
      <div>
        <h1 className='app-title'>Quick Link</h1>
        <div className='app-container'>
          <div className='link-generation-card'>
            <h2>Link Generation</h2>
            <div className='input-container'>
            <input type='text'
              className='user-input'
              placeholder='URL'
              value={url}
              onChange={(e) => { setUrl(e.target.value) }}
            />

            <input type='text'
              className='user-input'
              placeholder='Slug (optional)'
              value={slug}
              onChange={(e) => { setSlug(e.target.value) }}
            />

            <div className='short-url-container'>
            <input type='text'
            placeholder='Short URL'
            className='input-short-url'
            value={shorturl}
            disabled
            />
            <img src={ImgCopy} className='copy-icon'
            onClick={copyShortUrl}
            />
            </div>

            <button type='button' className='btn-generate-link'
            onClick={generateLink}
            >
              Do Magic
            </button>
            </div>
          </div>
          <div>
            <h2>All Links</h2>
          </div>
        </div>
      </div>
    </>
  )
}
export default App
