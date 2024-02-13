import { useState, useEffect } from 'react'
import Home from './Home.jsx'
import NewEntry from './NewEntry.jsx'
import CategorySelection from './CategorySelection.jsx'
import NavBar from './NavBar.jsx'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import ShowEntry from './ShowEntry.jsx'

function App() {
  const[categories, setCategories] = useState([])
  const [entries, setEntries] = useState([])
  const params = useParams()

  useEffect(() => {
    fetch('https://journal-api-m3ju.onrender.com/categories')
    .then(res => res.json())
    .then(data => setCategories(data))

    fetch('https://journal-api-m3ju.onrender.com/entries')
    .then(res => res.json())
    .then(data => setEntries(data)) 
  }, []
  
  )

  function addEntry(cat_id, content) {
    const newId = entries.length
    // 1. Create a entry object from user input
    const newEntry = {
        category: categories[cat_id]?._id,
        content: content,
    }

    fetch('https://journal-api-m3ju.onrender.com/entries', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEntry)
    })
    .then(res => res.json())
    .then(data => setEntries([...entries, data]))
    return newId
}

function ShowEntryWrapper() {
  const { id } = useParams()
  return <ShowEntry entry={entries[id]} />
}

  return (
    <>
      
      <BrowserRouter>
      <NavBar />
        <Routes>
          <Route path='/' element={<Home entries={entries} />} />
          <Route path='/category' element={<CategorySelection categories={categories}/>}/>
          <Route path='/entry'>
            <Route path=':id' element={<ShowEntryWrapper />}/>
            <Route path='new/:cat_id' element={<NewEntry categories={categories} addEntry={addEntry}/>}/>
          </Route>
          
          <Route path='*' element={<h2>Page Not Found</h2>}/>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
